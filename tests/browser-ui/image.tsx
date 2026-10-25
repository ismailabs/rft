/* eslint-disable @next/next/no-img-element -- Vite has no Next image runtime; local unoptimized images use the native element. */
import type { ImageProps } from "next/image";
/** Vite host renders the same unoptimized local artwork without Next runtime. */
export default function Image({
  src,
  alt,
  width,
  height,
  className,
  style,
  loading,
}: ImageProps) {
  const url =
    typeof src === "string" ? src : "src" in src ? src.src : src.default.src;
  return (
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={loading}
    />
  );
}
