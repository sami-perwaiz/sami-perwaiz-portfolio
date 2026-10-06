import { useRef, type ImgHTMLAttributes } from "react";
import useNearViewportMedia from "./useNearViewportMedia";

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
  deferUntilNearViewport?: boolean;
  rootMargin?: string;
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
  deferUntilNearViewport = loading === "lazy",
  rootMargin = "300px 0px",
  ...imageProps
}: ResponsiveImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const isNearViewport = useNearViewportMedia(imageRef, rootMargin);
  const shouldRequest = !deferUntilNearViewport || isNearViewport;
  const fallbackWidth = widths[widths.length - 1];
  if (!fallbackWidth) throw new Error(`ResponsiveImage requires at least one width: ${base}`);

  const image = (
    <img
      {...imageProps}
      ref={imageRef}
      src={shouldRequest ? `${base}-${fallbackWidth}.webp` : undefined}
      srcSet={shouldRequest ? createSrcSet(base, widths, "webp") : undefined}
      sizes={shouldRequest ? sizes : undefined}
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
      <source
        type="image/avif"
        srcSet={shouldRequest ? createSrcSet(base, widths, "avif") : undefined}
        sizes={shouldRequest ? sizes : undefined}
      />
      {image}
    </picture>
  );
}
