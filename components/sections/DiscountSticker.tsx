"use client";

import { useId } from "react";

interface DiscountStickerProps {
  percentage: number;
  className?: string;
}

function buildStarburstPoints(
  spikes: number,
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number
): string {
  const coords: string[] = [];
  const totalVertices = spikes * 2;
  const startAngle = -Math.PI / 2;

  for (let i = 0; i < totalVertices; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = startAngle + (i * Math.PI) / spikes;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    coords.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return coords.join(" ");
}

const STARBURST_POLYGON_POINTS = buildStarburstPoints(20, 60, 60, 52, 43);

export default function DiscountSticker({
  percentage,
  className = "",
}: DiscountStickerProps) {
  const gradientId = useId();

  return (
    <div
      className={`pointer-events-none select-none w-[82px] h-[82px] sm:w-[90px] sm:h-[90px] rotate-[8deg] drop-shadow-[0_6px_14px_rgba(140,109,43,0.34)] ${className}`}
      aria-label={`Special diskon ${percentage}%`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#D4B56A" />
              <stop offset="50%" stopColor="#C9A961" />
              <stop offset="100%" stopColor="#A68236" />
            </linearGradient>
          </defs>
          <polygon
            points={STARBURST_POLYGON_POINTS}
            fill={`url(#${gradientId})`}
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinejoin="miter"
            paintOrder="stroke fill"
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white leading-none px-2 -rotate-[2deg] drop-shadow-[0_1px_1.5px_rgba(84,61,16,0.38)]">
          <span className="font-serif-heading text-[8px] sm:text-[8.5px] font-bold uppercase tracking-[0.14em] text-white/95">
            SPECIAL
          </span>
          <span className="font-serif-heading text-[21px] sm:text-[23px] font-extrabold tracking-tight my-[1px]">
            {percentage}%
          </span>
          <span className="font-serif-heading text-[8px] sm:text-[8.5px] font-bold uppercase tracking-[0.16em] text-white/95">
            DISKON
          </span>
        </div>
      </div>
    </div>
  );
}
