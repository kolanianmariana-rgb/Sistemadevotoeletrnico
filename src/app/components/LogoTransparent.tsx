import { useEffect, useState } from 'react';

interface LogoTransparentProps {
  src: string;
  alt: string;
  className?: string;
  tolerance?: number;
}

export function LogoTransparent({ src, alt, className = '', tolerance = 40 }: LogoTransparentProps) {
  const [transparentSrc, setTransparentSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setTransparentSrc(null);
    setFailed(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setFailed(true); return; }

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const samplePoints = [
          [0, 0],
          [canvas.width - 1, 0],
          [0, canvas.height - 1],
          [canvas.width - 1, canvas.height - 1],
          [Math.floor(canvas.width / 2), 0],
        ];

        const samples = samplePoints.map(([x, y]) => {
          const idx = (y! * canvas.width + x!) * 4;
          return { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
        });

        const bgColor = samples[0];

        const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
          return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
        };

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const dist = colorDistance(r, g, b, bgColor.r, bgColor.g, bgColor.b);

          if (dist < tolerance) {
            const alpha = Math.round((dist / tolerance) * 255);
            data[i + 3] = alpha;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setTransparentSrc(canvas.toDataURL('image/png'));
      } catch {
        // Canvas tainted (CORS) — use img directly
        setFailed(true);
      }
    };

    img.onerror = () => {
      setFailed(true);
    };

    img.src = src;
  }, [src, tolerance]);

  return (
    <img
      src={transparentSrc ?? src}
      alt={alt}
      className={className}
    />
  );
}