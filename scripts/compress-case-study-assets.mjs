/**
 * Compress case-study docs PNGs (WebP + optimized PNG) and transcode MOV → MP4.
 * Visually lossless: PNG palette optimization, WebP q88, H.264 CRF 18.
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ASSETS_ROOT = path.join(ROOT, "public/assets/projects/case-study");
const MAX_DISPLAY_PX = 1472; // 2× 736px artboard
const WEBP_QUALITY = 88;
const PNG_COMPRESSION = 9;
const RESPONSIVE_WIDTHS = [480, 768];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fileSize(filePath) {
  const { size } = await stat(filePath);
  return size;
}

async function compressPng(pngPath) {
  const before = await fileSize(pngPath);
  const meta = await sharp(pngPath).metadata();
  const needsResize = meta.width > MAX_DISPLAY_PX;

  let pipeline = sharp(pngPath);
  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_DISPLAY_PX,
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  const optimized = pipeline.clone().png({
    compressionLevel: PNG_COMPRESSION,
    palette: false,
    effort: 10,
  });

  await optimized.toFile(`${pngPath}.tmp`);
  const afterPng = await fileSize(`${pngPath}.tmp`);

  const baseName = pngPath.replace(/\.png$/i, "");
  const webpOut = `${baseName}.webp`;
  await pipeline
    .clone()
    .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
    .toFile(webpOut);
  const afterWebp = await fileSize(webpOut);

  for (const width of RESPONSIVE_WIDTHS) {
    if (meta.width <= width) continue;
    const variantPath = `${baseName}-${width}.webp`;
    await sharp(pngPath)
      .resize({ width, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
      .toFile(variantPath);
  }

  const { rename, unlink } = await import("node:fs/promises");
  await rename(`${pngPath}.tmp`, pngPath);
  const after = await fileSize(pngPath);

  console.log(
    `  PNG ${path.basename(pngPath)}: ${formatBytes(before)} → ${formatBytes(after)} | WebP ${formatBytes(afterWebp)}`
  );
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || `ffmpeg exited ${code}`));
    });
  });
}

async function transcodeMov(movPath) {
  const mp4Path = movPath.replace(/\.mov$/i, ".mp4");
  const before = await fileSize(movPath);

  if (await stat(mp4Path).then(() => true).catch(() => false)) {
    const mp4Size = await fileSize(mp4Path);
    if (mp4Size > 0 && mp4Size < before) {
      console.log(
        `  MP4 ${path.basename(mp4Path)} already exists (${formatBytes(mp4Size)}), skipping transcode`
      );
      return;
    }
  }

  await runFfmpeg([
    "-y",
    "-i",
    movPath,
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-preset",
    "slow",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    mp4Path,
  ]);

  const after = await fileSize(mp4Path);
  console.log(
    `  MOV ${path.basename(movPath)}: ${formatBytes(before)} → MP4 ${formatBytes(after)}`
  );
}

async function main() {
  const allFiles = await walk(ASSETS_ROOT);
  const pngs = allFiles.filter(
    (f) =>
      /\/figma\/docs\/[^/]+\.png$/i.test(f) &&
      !/-(?:480|768)\.png$/i.test(f)
  );
  const movs = allFiles.filter((f) => /\/figma\/docs\/[^/]+\.mov$/i.test(f));

  console.log(`Compressing ${pngs.length} PNGs…`);
  for (const png of pngs) {
    await compressPng(png);
  }

  console.log(`\nTranscoding ${movs.length} MOVs…`);
  for (const mov of movs) {
    await transcodeMov(mov);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
