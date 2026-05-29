"use client";

interface ProgressBarProps {
  step: number; // 1–7
}

export default function ProgressBar({ step }: ProgressBarProps) {
  const pct = (step / 7) * 100;

  return (
    <div
      className="fixed left-0 top-0 z-50 w-full"
      style={{ height: "4px", background: "rgba(255,255,255,0.1)" }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: "var(--accent)",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}
