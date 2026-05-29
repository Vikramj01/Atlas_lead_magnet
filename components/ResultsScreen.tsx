"use client";

import ScoreArc from "./ScoreArc";
import {
  calculateScore,
  getRiskTier,
  getTierInfo,
  calculateLoss,
  formatLoss,
} from "@/lib/scoring";
import { generateFlags } from "@/lib/flags";

interface ResultsScreenProps {
  answers: Record<string, string>;
  bookingUrl: string;
  atlasUrl: string;
}

const TIER_HEX: Record<string, string> = {
  optimised: "#00E5A0",
  partial: "#F5A623",
  at_risk: "#E05C5C",
  critical: "#CC2222",
};

const PLATFORM_HINTS: Record<string, string> = {
  sfcc: "Signal gaps on Salesforce Commerce Cloud often stem from server-side event misfires at order confirmation. A direct server-to-server integration with Google Ads is the reliable fix.",
  shopify:
    "Shopify's native tracking relies heavily on the thank you page pixel. Server-side events via Shopify's Customer Events API are the upgrade path.",
  magento:
    "Magento / Adobe Commerce custom implementations vary widely. Server-side tagging is often missing entirely, which means full client-side exposure.",
  custom:
    "Custom-built platforms have the most flexibility — and the most variability. The gap is usually in server-side event coverage and Enhanced Conversions setup.",
};

export default function ResultsScreen({
  answers,
  bookingUrl,
  atlasUrl,
}: ResultsScreenProps) {
  const score = calculateScore(answers);
  const tier = getRiskTier(score);
  const tierInfo = getTierInfo(tier);
  const tierColor = TIER_HEX[tier];
  const lossResult = calculateLoss(score, answers.q7_spend_bracket ?? "");
  const lossString = formatLoss(lossResult, score);
  const flags = generateFlags(answers);
  const platformHint = PLATFORM_HINTS[answers.q1_platform ?? ""];

  return (
    <div className="flex flex-col items-center py-12" style={{ gap: "40px" }}>

      {/* ── Section A: Score display ────────────────────────────────── */}
      <div className="flex flex-col items-center text-center" style={{ gap: "12px" }}>
        <ScoreArc score={score} tier={tier} />

        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: tierColor,
            textTransform: "uppercase",
          }}
        >
          {tierInfo.label}
        </p>

        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--text-secondary)",
            maxWidth: "420px",
            lineHeight: 1.6,
          }}
        >
          {tierInfo.description}
        </p>
      </div>

      {/* ── Section B: Dollar estimate ──────────────────────────────── */}
      <div
        className="w-full"
        style={{
          maxWidth: "420px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "20px 24px",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "8px",
          }}
        >
          Estimated monthly signal loss
        </p>

        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "10px",
          }}
        >
          {lossString}
        </p>

        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
          }}
        >
          Based on your spend level and the gaps identified below. This is an
          estimate — your actual figure depends on mobile traffic mix, ad blocker
          rates, and iOS share in your market.
        </p>
      </div>

      {/* ── Section C: Risk flags ───────────────────────────────────── */}
      <div className="w-full flex flex-col" style={{ gap: "16px" }}>
        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          What the gaps look like
        </h2>

        {flags.map((flag, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
            }}
          >
            {/* Accent dot */}
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent)",
                flexShrink: 0,
                marginTop: "6px",
              }}
            />
            <div>
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {flag.headline}
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  marginTop: "6px",
                  lineHeight: 1.6,
                }}
              >
                {flag.body}
              </p>
            </div>
          </div>
        ))}

        {/* Platform hint */}
        {platformHint && (
          <div
            style={{
              background: "var(--bg-card)",
              borderLeft: "3px solid var(--accent)",
              borderRadius: "0 8px 8px 0",
              padding: "14px 18px",
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
            >
              {platformHint}
            </p>
          </div>
        )}
      </div>

      {/* ── Section D: CTA block ────────────────────────────────────── */}
      <div className="w-full flex flex-col items-start" style={{ gap: "16px" }}>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto block text-center"
          style={{
            background: "var(--accent)",
            color: "#0A0A0F",
            fontWeight: 600,
            padding: "14px 28px",
            borderRadius: "8px",
            fontSize: "1rem",
            textDecoration: "none",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.background =
              "var(--accent-hover)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.background =
              "var(--accent)")
          }
        >
          Get a full signal audit →
        </a>

        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            maxWidth: "420px",
            lineHeight: 1.6,
          }}
        >
          We audit your full tracking environment — ad platforms, analytics, and
          CRM — and deliver a prioritised fix list within 48 hours. One
          engagement. No ongoing commitment required.
        </p>

        <a
          href={atlasUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--accent)",
            fontSize: "0.9375rem",
            textDecoration: "none",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.textDecoration =
              "underline")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.textDecoration =
              "none")
          }
        >
          Learn how Atlas works →
        </a>
      </div>

      {/* Bottom padding */}
      <div style={{ height: "24px" }} />
    </div>
  );
}
