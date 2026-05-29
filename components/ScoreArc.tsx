"use client";

import { motion } from "framer-motion";
import type { RiskTier } from "@/lib/scoring";

interface ScoreArcProps {
  score: number;
  tier: RiskTier;
}

const TIER_HEX: Record<RiskTier, string> = {
  optimised: "#00E5A0",
  partial: "#F5A623",
  at_risk: "#E05C5C",
  critical: "#CC2222",
};

const RADIUS = 90;
const STROKE_WIDTH = 8;
const SIZE = 220;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreArc({ score, tier }: ScoreArcProps) {
  const color = TIER_HEX[tier];
  const finalOffset = CIRCUMFERENCE * (1 - score / 100);
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  return (
    <div className="relative flex items-center justify-center">
      {/* Responsive size: 200px on mobile, 220px on desktop */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-[200px] sm:w-[220px] h-auto"
        aria-label={`Signal Health Score: ${score} out of 100`}
      >
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE_WIDTH}
        />

        {/* Foreground arc — starts at top (rotated -90°) */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: finalOffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>

      {/* Score text centred over the SVG */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ color }}
      >
        <span
          style={{
            fontSize: "3.5rem",
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 400,
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          / 100
        </span>
      </div>
    </div>
  );
}
