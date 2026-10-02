import type { ImgHTMLAttributes } from "react";

type ResponsiveImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "sizes" | "width" | "height"
> & {
  base: string;
  widths: readonly number[];
  sizes: string;
  sourceWidth: number;
  sourceHeight: number;
  avif?: boolean;
};

function createSrcSet(base: string, widths: readonly number[], format: "avif" | "webp") {
  return widths.map((width) => `${base}-${width}.${format} ${width}w`).join(", ");
}

export default function ResponsiveImage({
  avif = false,
  base,
  widths,
  sizes,
  sourceWidth,
  sourceHeight,
  alt = "",
  decoding = "async",
  loading = "lazy",
  ...imageProps
}: ResponsiveImageProps) {
  const fallbackWidth = widths[widths.length - 1];
  if (!fallbackWidth) throw new Error(`ResponsiveImage requires at least one width: ${base}`);

  const image = (
    <img
      {...imageProps}
      src={`${base}-${fallbackWidth}.webp`}
      srcSet={createSrcSet(base, widths, "webp")}
      sizes={sizes}
      width={sourceWidth}
      height={sourceHeight}
      alt={alt}
      loading={loading}
      decoding={decoding}
    />
  );

  if (!avif) return image;

  return (
    <picture>
      <source type="image/avif" srcSet={createSrcSet(base, widths, "avif")} sizes={sizes} />
      {image}
    </picture>
  );
}
