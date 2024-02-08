import { CSSProperties, useEffect, useRef, useState } from "react"
import ImagePlaceholder from "../assets/images/no-image-placeholder.jpeg";

type ImageProps = {
  src?: string | undefined;
  alt?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  style?: CSSProperties | undefined;
  className?: string | undefined;
  loading?: "lazy" | "eager";
}

export default function Image({ src, alt, width, height, style, className, loading = "lazy" }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.naturalWidth >= 0) {
      setLoaded(true);
    }
  })

  return (
    <>
      {!loaded && <div id="spinner"> </div>}
      <img
        ref={ref}
        loading={loading}
        src={loaded && isError ? ImagePlaceholder : src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        className={className}
        onError={() => setIsError(true)}
      />
    </>
  )
}