"use client";

interface AnswerCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function AnswerCard({ label, selected, onClick }: AnswerCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left transition-colors duration-150"
      style={{
        padding: "16px 20px",
        borderRadius: "12px",
        border: `1px solid ${selected ? "var(--border-selected)" : "var(--border)"}`,
        background: selected ? "var(--accent-dim)" : "var(--bg-card)",
        color: "var(--text-primary)",
        fontSize: "1rem",
        fontWeight: 500,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--bg-card-hover)";
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(0,229,160,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--bg-card)";
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--border)";
        }
      }}
    >
      {label}
    </button>
  );
}
