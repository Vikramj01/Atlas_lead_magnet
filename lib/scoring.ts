export type RiskTier = "optimised" | "partial" | "at_risk" | "critical";

export interface TierInfo {
  label: string;
  description: string;
  colorVar: string;
}

export interface LossResult {
  low: number | null;
  high: number | null;
  percentOnly: boolean;
}

// ── Score deduction tables ────────────────────────────────────────────────────

const Q2_DEDUCTIONS: Record<string, number> = {
  button_click: 35,
  thank_you_page: 20,
  server_side_only: 5,
  both_dedup: 0,
  not_sure: 25,
};

const Q3_DEDUCTIONS: Record<string, number> = {
  yes_configured: 0,
  no: 20,
  not_sure: 15,
};

const Q4_DEDUCTIONS: Record<string, number> = {
  yes: 0,
  no: 20,
  not_sure: 15,
};

const Q5_MODIFIERS: Record<string, number> = {
  under_40: 0,
  "40_to_65": 5,
  over_65: 10,
};

// ── Scoring ───────────────────────────────────────────────────────────────────

export function calculateScore(answers: Record<string, string>): number {
  const q2 = Q2_DEDUCTIONS[answers.q2_conversion_location] ?? 0;
  const q3 = Q3_DEDUCTIONS[answers.q3_enhanced_conversions] ?? 0;
  const q4 = Q4_DEDUCTIONS[answers.q4_server_side] ?? 0;

  const q4Answer = answers.q4_server_side;
  const q5Applies = q4Answer === "no" || q4Answer === "not_sure";
  const q5 = q5Applies ? (Q5_MODIFIERS[answers.q5_mobile_share] ?? 0) : 0;

  return Math.max(5, 100 - q2 - q3 - q4 - q5);
}

// ── Risk tier ─────────────────────────────────────────────────────────────────

export function getRiskTier(score: number): RiskTier {
  if (score >= 75) return "optimised";
  if (score >= 50) return "partial";
  if (score >= 25) return "at_risk";
  return "critical";
}

const TIER_INFO: Record<RiskTier, TierInfo> = {
  optimised: {
    label: "Optimised",
    description:
      "Your signal architecture is above average. Targeted refinements could still improve bidding precision.",
    colorVar: "--risk-optimised",
  },
  partial: {
    label: "Partial Coverage",
    description:
      "Gaps in your signal setup are likely costing you measurable campaign performance each month.",
    colorVar: "--risk-partial",
  },
  at_risk: {
    label: "At Risk",
    description:
      "Your ad platforms are making budget decisions on significantly incomplete data.",
    colorVar: "--risk-atrisk",
  },
  critical: {
    label: "Critical",
    description:
      "Fundamental tracking gaps are actively degrading your campaign results. This needs to be addressed before further spend increases.",
    colorVar: "--risk-critical",
  },
};

export function getTierInfo(tier: RiskTier): TierInfo {
  return TIER_INFO[tier];
}

// ── Loss % ranges by tier ─────────────────────────────────────────────────────

const LOSS_PCT: Record<RiskTier, { low: number; high: number; label: string }> =
  {
    optimised: { low: 5, high: 10, label: "5–10%" },
    partial: { low: 15, high: 30, label: "15–30%" },
    at_risk: { low: 30, high: 45, label: "30–45%" },
    critical: { low: 45, high: 60, label: "45–60%" },
  };

// ── Dollar estimate ───────────────────────────────────────────────────────────

export function calculateLoss(
  score: number,
  spendBracket: string
): LossResult {
  if (spendBracket === "under_5k") {
    return { low: null, high: null, percentOnly: true };
  }

  const tier = getRiskTier(score);
  const { low: pctLow, high: pctHigh } = LOSS_PCT[tier];

  const midpoints: Record<string, number> = {
    "5k_20k": 12500,
    "20k_75k": 47500,
    over_75k: 150000,
  };

  const midpoint = midpoints[spendBracket];
  if (midpoint === undefined) {
    return { low: null, high: null, percentOnly: true };
  }

  const roundTo = spendBracket === "5k_20k" ? 100 : 1000;
  const rawLow = midpoint * (pctLow / 100);
  const rawHigh = midpoint * (pctHigh / 100);

  return {
    low: Math.round(rawLow / roundTo) * roundTo,
    high: Math.round(rawHigh / roundTo) * roundTo,
    percentOnly: false,
  };
}

// ── Format helpers ────────────────────────────────────────────────────────────

function formatDollar(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export function formatLoss(result: LossResult, score: number): string {
  if (result.percentOnly) {
    const tier = getRiskTier(score);
    return `${LOSS_PCT[tier].label} of conversions not reaching your ad platforms`;
  }
  return `${formatDollar(result.low!)} – ${formatDollar(result.high!)}`;
}
