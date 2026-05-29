"use client";

import AnswerCard from "./AnswerCard";

interface Option {
  label: string;
  value: string;
}

interface QuestionScreenProps {
  step: number;
  question: string;
  subtext?: string;
  contextNote: string;
  options: Option[];
  selected: string | null;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function QuestionScreen({
  step,
  question,
  subtext,
  contextNote,
  options,
  selected,
  onSelect,
  onNext,
  onBack,
}: QuestionScreenProps) {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12">
      {/* Step label */}
      <p
        className="mb-6 text-sm font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        Question {step} of 7
      </p>

      {/* Question headline */}
      <h2
        className="mb-3"
        style={{
          fontSize: "1.75rem",
          fontWeight: 600,
          lineHeight: 1.3,
          color: "var(--text-primary)",
        }}
      >
        {question}
      </h2>

      {/* Optional subtext */}
      {subtext && (
        <p
          className="mb-6"
          style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}
        >
          {subtext}
        </p>
      )}

      {/* Answer cards */}
      <div className="mb-8 flex flex-col" style={{ gap: "12px" }}>
        {options.map((opt) => (
          <AnswerCard
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>

      {/* Context note */}
      <p
        className="mb-10"
        style={{
          fontSize: "0.875rem",
          fontWeight: 400,
          color: "var(--text-muted)",
        }}
      >
        {contextNote}
      </p>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.875rem",
              padding: 0,
            }}
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={!selected}
          style={{
            background: selected ? "var(--accent)" : "rgba(0,229,160,0.25)",
            color: "#0A0A0F",
            fontWeight: 600,
            padding: "14px 28px",
            borderRadius: "8px",
            border: "none",
            cursor: selected ? "pointer" : "not-allowed",
            fontSize: "1rem",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (selected)
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent-hover)";
          }}
          onMouseLeave={(e) => {
            if (selected)
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent)";
          }}
        >
          {step === 7 ? "See my score →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
