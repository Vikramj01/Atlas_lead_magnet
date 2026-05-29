"use client";

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12">
      <h1
        className="mb-5 text-balance"
        style={{
          fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
          fontWeight: 700,
          lineHeight: 1.2,
          color: "var(--text-primary)",
        }}
      >
        Is your ad spend training Google on the wrong customers?
      </h1>

      <p
        className="mb-4"
        style={{
          fontSize: "1.125rem",
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          maxWidth: "520px",
        }}
      >
        Answer 7 questions about your tracking setup. Get your Signal Health
        Score and an estimate of what the gaps are costing you each month.
      </p>

      <p
        className="mb-10"
        style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}
      >
        Takes under 3 minutes. No login required.
      </p>

      <div className="flex flex-col items-start gap-4">
        <button
          type="button"
          onClick={onStart}
          className="w-full sm:w-auto"
          style={{
            background: "var(--accent)",
            color: "#0A0A0F",
            fontWeight: 600,
            padding: "14px 28px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "var(--accent-hover)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "var(--accent)")
          }
        >
          Start the assessment →
        </button>

        <p
          style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}
        >
          Used by performance marketing teams in the UAE, Singapore, and
          Southeast Asia.
        </p>
      </div>
    </div>
  );
}
