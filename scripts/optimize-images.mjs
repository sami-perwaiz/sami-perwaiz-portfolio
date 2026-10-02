import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceRoot = path.join(root, "original-assets/public-assets");
const publicRoot = path.join(root, "public/assets");
const outputRoot = path.join(publicRoot, "optimized");
const shouldClean = process.argv.includes("--clean");

if (!fs.existsSync(sourceRoot)) {
  throw new Error("Missing original-assets/public-assets. Restore the source backup before optimizing.");
}

const responsive = [
  { source: "imgRectangle1410127957.png", output: "home/imgRectangle1410127957", widths: [64, 128, 192], mode: "photo" },
  { source: "imgSignUpScreen1.png", output: "home/imgSignUpScreen1", widths: [640, 1024, 1280], mode: "ui" },
  { source: "imgSignUpScreen2.png", output: "home/imgSignUpScreen2", widths: [640, 1024, 1280], mode: "ui" },
  { source: "imgSignUpScreen3.png", output: "home/imgSignUpScreen3", widths: [768, 1024, 1440, 2560], mode: "ui" },
  { source: "imgSignUpScreen4.png", output: "home/imgSignUpScreen4", widths: [640, 1024, 1280], mode: "ui" },
  { source: "imgSignUpScreen5.png", output: "home/imgSignUpScreen5", widths: [640, 1024, 1280], mode: "ui" },
  { source: "imgSignUpScreen6.png", output: "home/imgSignUpScreen6", widths: [768, 1024, 1440, 2560], mode: "ui" },
  { source: "imgDashboard3.png", output: "home/imgDashboard3", widths: [640, 1024, 1280], mode: "ui" },
  { source: "imgSignUpScreen7.png", output: "home/imgSignUpScreen7", widths: [640, 1024, 1280], mode: "ui" },
  { source: "imgImage69.png", output: "home/imgImage69", widths: [256, 512, 768], mode: "ui" },
  { source: "imgImage565.png", output: "home/imgImage565", widths: [320, 640, 800], mode: "ui" },
  { source: "imgImage564.png", output: "home/imgImage564", widths: [640, 1280], mode: "ui" },
  { source: "imgRectangle1410127969.png", output: "home/imgRectangle1410127969", widths: [400, 800, 1200], mode: "photo" },
  { source: "imgRectangle1410127975.png", output: "home/imgRectangle1410127975", widths: [64, 128], mode: "ui" },
  { source: "imgRectangle1410128004.png", output: "home/imgRectangle1410128004", widths: [64, 128], mode: "photo" },
  { source: "serviceBrandingPreview.png", output: "home/serviceBrandingPreview", widths: [320, 640, 960], mode: "ui" },
  { source: "serviceAppPreview.png", output: "home/serviceAppPreview", widths: [320, 640, 960], mode: "ui" },
  { source: "serviceWebPreview.png", output: "home/serviceWebPreview", widths: [320, 640, 960], mode: "ui" },
  { source: "serviceLandingPreview.png", output: "home/serviceLandingPreview", widths: [320, 640, 960], mode: "ui" },
  { source: "serviceNocodePreview.png", output: "home/serviceNocodePreview", widths: [320, 640, 960], mode: "ui" },
  { source: "imgRectangle1410127900.png", output: "gallery/imgRectangle1410127900", widths: [640, 1024, 1200, 1800], mode: "gallery", avif: true },
  { source: "imgRectangle1410127907.png", output: "gallery/imgRectangle1410127907", widths: [480, 900, 1200], mode: "gallery", avif: true },
  { source: "imgRectangle1410127902.png", output: "gallery/imgRectangle1410127902", widths: [480, 900, 1200], mode: "gallery", avif: true },
  { source: "imgRectangle1410127908.png", output: "gallery/imgRectangle1410127908", widths: [480, 900, 1200], mode: "gallery", avif: true },
  { source: "imgRectangle1410127904.png", output: "gallery/imgRectangle1410127904", widths: [480, 900, 1200], mode: "gallery", avif: true },
  { source: "imgRectangle1410127906.png", output: "gallery/imgRectangle1410127906", widths: [640, 1024, 1200, 1800], mode: "gallery", avif: true },
  { source: "imgRectangle1410127910.png", output: "gallery/imgRectangle1410127910", widths: [480, 900, 1200], mode: "gallery", avif: true },
];

const singleWebp = [
  "imgImage568.png",
  "imgImage616.png",
  "imgImage617.png",
].map((source) => ({ source, output: `legacy/${path.parse(source).name}` }));

const flarePngs = fs
  .readdirSync(path.join(sourceRoot, "flare-case-study"))
  .filter((name) => name.endsWith(".png"))
  .sort()
  .map((name) => ({ source: `flare-case-study/${name}`, output: `flare/${path.parse(name).name}` }));

const unusedProductionFiles = [
  "imgImage560.png",
  "imgImage562.png",
  "imgImage566.png",
  "imgImage618.png",
  "imgImage569.png",
  "imgImage570.png",
  "imgImage619.png",
  "imgImage620.png",
  "imgImage571.png",
  "imgImage572.png",
  "imgImage631.png",
  "imgNewBranding1.png",
  "imgImage632.png",
  "imgImage633.png",
  "imgImage634.png",
  "imgImage635.png",
  "imgImage638.png",
  "imgImage636.png",
  "imgImage637.png",
  "imgImage639.png",
  "imgImage640.png",
  "ctaDecor4x.png",
  "heroPortrait4x.png",
];

const report = [];

function ensureParent(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

async function validateVariant(sourceMetadata, outputFile, expectedWidth) {
  const metadata = await sharp(outputFile).metadata();
  const expectedHeight = Math.round((sourceMetadata.height * expectedWidth) / sourceMetadata.width);
  if (metadata.width !== expectedWidth || metadata.height !== expectedHeight) {
    throw new Error(
      `Ratio validation failed for ${outputFile}: expected ${expectedWidth}x${expectedHeight}, got ${metadata.width}x${metadata.height}`,
    );
  }
  return metadata;
}

async function writeVariant(entry, width, format) {
  const sourceFile = path.join(sourceRoot, entry.source);
  const sourceMetadata = await sharp(sourceFile).metadata();
  const targetWidth = Math.min(width, sourceMetadata.width);
  const outputFile = path.join(outputRoot, `${entry.output}-${targetWidth}.${format}`);
  ensureParent(outputFile);

  let pipeline = sharp(sourceFile).resize({ width: targetWidth, withoutEnlargement: true });
  if (format === "avif") {
    pipeline = pipeline.avif({ quality: 80, effort: 7, chromaSubsampling: "4:4:4" });
  } else if (entry.mode === "ui") {
    pipeline = pipeline.webp({ lossless: true, effort: 6 });
  } else {
    pipeline = pipeline.webp({ quality: 94, effort: 6, smartSubsample: true });
  }

  await pipeline.toFile(outputFile);
  const outputMetadata = await validateVariant(sourceMetadata, outputFile, targetWidth);
  report.push({
    source: entry.source,
    output: path.relative(root, outputFile),
    format,
    sourceWidth: sourceMetadata.width,
    sourceHeight: sourceMetadata.height,
    width: outputMetadata.width,
    height: outputMetadata.height,
    bytes: fs.statSync(outputFile).size,
  });
}

async function writeSingleWebp(entry) {
  const sourceFile = path.join(sourceRoot, entry.source);
  const sourceMetadata = await sharp(sourceFile).metadata();
  const outputFile = path.join(outputRoot, `${entry.output}.webp`);
  ensureParent(outputFile);
  await sharp(sourceFile).webp({ lossless: true, effort: 6 }).toFile(outputFile);
  const outputMetadata = await sharp(outputFile).metadata();
  if (sourceMetadata.width !== outputMetadata.width || sourceMetadata.height !== outputMetadata.height) {
    throw new Error(`Ratio validation failed for ${outputFile}`);
  }
  report.push({
    source: entry.source,
    output: path.relative(root, outputFile),
    format: "webp",
    sourceWidth: sourceMetadata.width,
    sourceHeight: sourceMetadata.height,
    width: outputMetadata.width,
    height: outputMetadata.height,
    bytes: fs.statSync(outputFile).size,
  });
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

for (const entry of responsive) {
  const metadata = await sharp(path.join(sourceRoot, entry.source)).metadata();
  const widths = [...new Set(entry.widths.filter((width) => width <= metadata.width))];
  for (const width of widths) {
    await writeVariant(entry, width, "webp");
    if (entry.avif) await writeVariant(entry, width, "avif");
  }
}

for (const entry of [...singleWebp, ...flarePngs]) {
  await writeSingleWebp(entry);
}

const originalBytes = [...responsive, ...singleWebp, ...flarePngs].reduce(
  (total, entry) => total + fs.statSync(path.join(sourceRoot, entry.source)).size,
  0,
);
const outputBytes = report.reduce((total, entry) => total + entry.bytes, 0);
const responsiveSources = new Set(responsive.map((entry) => entry.source));

if (shouldClean) {
  const replacedSources = [...responsive, ...singleWebp, ...flarePngs].map((entry) => entry.source);
  for (const relativeFile of [...replacedSources, ...unusedProductionFiles]) {
    fs.rmSync(path.join(publicRoot, relativeFile), { force: true });
  }
}

const summary = {
  sourceFilesReplaced: new Set(report.map((entry) => entry.source)).size,
  responsiveOutputs: report.filter((entry) => responsiveSources.has(entry.source)).length,
  webpOutputs: report.filter((entry) => entry.format === "webp").length,
  avifOutputs: report.filter((entry) => entry.format === "avif").length,
  originalBytes,
  outputBytes,
  generatedSavingsPercent: Number((100 - (outputBytes / originalBytes) * 100).toFixed(2)),
  cleanedUnusedFiles: shouldClean ? unusedProductionFiles.length : 0,
};

fs.writeFileSync(
  path.join(root, "image-optimization-report.json"),
  `${JSON.stringify({ summary, variants: report }, null, 2)}\n`,
);

console.log(`Generated ${report.length} optimized files.`);
console.log(`Source files represented: ${summary.sourceFilesReplaced}`);
console.log(`Original represented size: ${formatBytes(originalBytes)}`);
console.log(`Generated variants size: ${formatBytes(outputBytes)}`);
console.log(`Generated-set savings: ${summary.generatedSavingsPercent}%`);
console.log(`WebP: ${summary.webpOutputs}; AVIF: ${summary.avifOutputs}; responsive outputs: ${summary.responsiveOutputs}`);
if (shouldClean) console.log(`Removed ${unusedProductionFiles.length} confirmed-unused production files after backup.`);
