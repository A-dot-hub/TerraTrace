import React from "react";

/**
 * TerraTrace Brand Icon & Logo
 * Designed directly from the uploaded neon botanical sprout insignia:
 * - Central pinnate leaf with symmetrical vein lines
 * - Sweeping left foliage leaf with inner structure
 * - Sweeping right branch with leaf contour and upper bud node
 * - Rooted triple-stem trunk base
 */
export function TerraTraceIcon({ className = "w-6 h-6", glow = true }) {
  const gradientId = "ttLogoGrad";
  const glowId = "ttLogoGlow";

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        {glow && (
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      <g
        stroke={`url(#${gradientId})`}
        strokeWidth="4.5"
        filter={glow ? `url(#${glowId})` : undefined}
      >
        {/* Central Main Leaf Outer Contour */}
        <path d="M 50 62 C 34 50 32 30 50 12 C 68 30 66 50 50 62 Z" />

        {/* Central Leaf Midrib Spine */}
        <path d="M 50 62 L 50 16" />

        {/* Central Leaf Side Veins (Left) */}
        <path d="M 50 49 C 42 45 39 40 37 36" />
        <path d="M 50 39 C 43 35 41 30 40 25" />
        <path d="M 50 29 C 46 25 45 22 44 19" />

        {/* Central Leaf Side Veins (Right) */}
        <path d="M 50 49 C 58 45 61 40 63 36" />
        <path d="M 50 39 C 57 35 59 30 60 25" />
        <path d="M 50 29 C 54 25 55 22 56 19" />

        {/* Left Foliage Leaf Outline */}
        <path d="M 43 67 C 29 66 18 55 18 41 C 18 31 26 25 36 29 C 42 33 46 45 43 67 Z" />
        {/* Left Leaf Veins */}
        <path d="M 43 64 C 33 55 27 46 22 36" />
        <path d="M 33 53 C 27 52 23 48 20 44" />
        <path d="M 37 45 C 32 42 29 37 27 33" />

        {/* Right Curved Branch Outline */}
        <path d="M 57 69 C 67 64 77 55 76 39 C 75 28 67 24 60 29" />
        {/* Right Branch Veins */}
        <path d="M 57 65 C 65 57 69 47 70 37" />
        <path d="M 64 53 C 70 50 73 44 74 37" />

        {/* Delicate shoot extending to top-right bud */}
        <path d="M 66 32 C 74 26 77 21 79 16" />
        {/* Sprout / Bud Node (Circle) */}
        <circle
          cx="80.5"
          cy="15.5"
          r="3"
          fill="#34d399"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
        />

        {/* Rooted Stem Base: Triple Parallel Trunk Lines */}
        {/* Center trunk continuation */}
        <path d="M 50 62 L 50 88" />
        {/* Left trunk line */}
        <path d="M 42 66 C 42 74 43 82 43 88" />
        {/* Right trunk line */}
        <path d="M 58 66 C 58 74 57 82 57 88" />
      </g>
    </svg>
  );
}

/**
 * TerraTrace Badge Container
 * Replaces the old "TT" badge block with the sleek dark neon eco badge.
 */
export function TerraTraceLogo({
  size = "md",
  className = "",
  showText = false,
  subtext = false,
}) {
  const sizeMap = {
    sm: {
      box: "w-7 h-7 rounded-lg",
      icon: "w-5 h-5",
      text: "text-sm",
      sub: "text-[9px]",
    },
    md: {
      box: "w-9 h-9 rounded-xl",
      icon: "w-6 h-6",
      text: "text-base",
      sub: "text-[10px]",
    },
    lg: {
      box: "w-11 h-11 rounded-xl",
      icon: "w-8 h-8",
      text: "text-xl",
      sub: "text-xs",
    },
    xl: {
      box: "w-14 h-14 rounded-2xl",
      icon: "w-10 h-10",
      text: "text-2xl",
      sub: "text-sm",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${currentSize.box} bg-neutral-950 dark:bg-neutral-900 border border-emerald-900/60 dark:border-emerald-800/60 flex items-center justify-center shadow-sm shadow-emerald-950/40 relative overflow-hidden group-hover:border-emerald-500 transition-colors flex-shrink-0`}
      >
        <div className="absolute inset-0 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        <TerraTraceIcon className={`${currentSize.icon} relative z-10`} />
      </div>

      {showText && (
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold ${currentSize.text} tracking-tight text-neutral-900 dark:text-white font-display`}
            >
              TerraTrace
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold">
              v1.0
            </span>
          </div>
          {subtext && (
            <p
              className={`${currentSize.sub} text-neutral-400 dark:text-neutral-500 font-medium`}
            >
              Sustainability Intelligence
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TerraTraceLogo;
