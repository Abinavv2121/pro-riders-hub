import { useEffect, useState } from "react";

interface TrimmedProductImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const ALPHA_THRESHOLD = 10;
const RGB_THRESHOLD = 253;

const isBackgroundPixel = (r: number, g: number, b: number, a: number) =>
  a <= ALPHA_THRESHOLD || (r >= RGB_THRESHOLD && g >= RGB_THRESHOLD && b >= RGB_THRESHOLD);

const TrimmedProductImage = ({ src, alt, className, style }: TrimmedProductImageProps) => {
  const [displaySrc, setDisplaySrc] = useState(src);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let isMounted = true;
    let objectUrlToRevoke: string | null = null;

    setDisplaySrc(src);

    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      try {
        const width = image.naturalWidth;
        const height = image.naturalHeight;

        if (!width || !height) {
          return;
        }

        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = width;
        sourceCanvas.height = height;

        const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
        if (!sourceContext) {
          return;
        }

        sourceContext.drawImage(image, 0, 0);
        const { data } = sourceContext.getImageData(0, 0, width, height);

        let top = height;
        let left = width;
        let right = -1;
        let bottom = -1;

        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const offset = (y * width + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const a = data[offset + 3];

            if (isBackgroundPixel(r, g, b, a)) {
              continue;
            }

            if (x < left) left = x;
            if (x > right) right = x;
            if (y < top) top = y;
            if (y > bottom) bottom = y;
          }
        }

        if (right < left || bottom < top) {
          return;
        }

        const paddingX = Math.max(4, Math.round((right - left + 1) * 0.02));
        const paddingY = Math.max(4, Math.round((bottom - top + 1) * 0.02));
        const cropLeft = Math.max(0, left - paddingX);
        const cropTop = Math.max(0, top - paddingY);
        const cropRight = Math.min(width, right + paddingX + 1);
        const cropBottom = Math.min(height, bottom + paddingY + 1);
        const cropWidth = cropRight - cropLeft;
        const cropHeight = cropBottom - cropTop;

        if (cropWidth <= 0 || cropHeight <= 0) {
          return;
        }

        const trimmedCanvas = document.createElement("canvas");
        trimmedCanvas.width = cropWidth;
        trimmedCanvas.height = cropHeight;

        const trimmedContext = trimmedCanvas.getContext("2d");
        if (!trimmedContext) {
          return;
        }

        trimmedContext.drawImage(
          image,
          cropLeft,
          cropTop,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight,
        );

        const trimmedDataUrl = trimmedCanvas.toDataURL("image/png");

        if (!isMounted) {
          return;
        }

        objectUrlToRevoke = trimmedDataUrl.startsWith("blob:") ? trimmedDataUrl : null;
        setDisplaySrc(trimmedDataUrl);
      } catch {
        if (isMounted) {
          setDisplaySrc(src);
        }
      }
    };

    image.onerror = () => {
      if (isMounted) {
        setDisplaySrc(src);
      }
    };

    image.src = src;

    return () => {
      isMounted = false;
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [src]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-zoom-in flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={displaySrc}
        alt={alt}
        className={`${className} transition-transform duration-100 ease-out`}
        style={{
          ...style,
          transform: isHovered ? "scale(2.2)" : "scale(1)",
          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
        }}
        loading="eager"
        draggable={false}
      />
    </div>
  );
};

export default TrimmedProductImage;
