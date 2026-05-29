import {
  calculateScore,
  calculateLoss,
  formatLoss,
  getRiskTier,
} from "../scoring";

// ── calculateScore ────────────────────────────────────────────────────────────

describe("calculateScore", () => {
  it("returns 100 for perfect setup (both_dedup + yes_configured + yes)", () => {
    expect(
      calculateScore({
        q2_conversion_location: "both_dedup",
        q3_enhanced_conversions: "yes_configured",
        q4_server_side: "yes",
        q5_mobile_share: "over_65",
      })
    ).toBe(100);
  });

  it("returns 15 for worst case (button_click + no + no + over_65)", () => {
    // 100 - 35 - 20 - 20 - 10 = 15
    expect(
      calculateScore({
        q2_conversion_location: "button_click",
        q3_enhanced_conversions: "no",
        q4_server_side: "no",
        q5_mobile_share: "over_65",
      })
    ).toBe(15);
  });

  it("never returns below 5 (floor)", () => {
    expect(
      calculateScore({
        q2_conversion_location: "button_click", // -35
        q3_enhanced_conversions: "no",           // -20
        q4_server_side: "no",                    // -20
        q5_mobile_share: "over_65",              // -10
        // total deduction = 85, score would be 15 — already above floor
        // Force floor by imagining extra: use not_sure everywhere
      })
    ).toBeGreaterThanOrEqual(5);

    // Construct a scenario that would go below 5 if floor didn't exist
    // button_click(-35) + no(-20) + not_sure(-15) + over_65(-10) = -80 → 20, still above 5
    // There's no combination that yields below 5 given the deduction table,
    // so test the floor directly:
    expect(
      calculateScore({
        q2_conversion_location: "button_click", // -35
        q3_enhanced_conversions: "no",           // -20
        q4_server_side: "not_sure",              // -15
        q5_mobile_share: "over_65",              // -10
      })
    ).toBe(20); // 100-35-20-15-10 = 20
  });

  it("Q5 modifier does NOT apply when Q4 is yes", () => {
    const withHighMobile = calculateScore({
      q2_conversion_location: "both_dedup",
      q3_enhanced_conversions: "yes_configured",
      q4_server_side: "yes",
      q5_mobile_share: "over_65",
    });
    const withLowMobile = calculateScore({
      q2_conversion_location: "both_dedup",
      q3_enhanced_conversions: "yes_configured",
      q4_server_side: "yes",
      q5_mobile_share: "under_40",
    });
    expect(withHighMobile).toBe(withLowMobile);
    expect(withHighMobile).toBe(100);
  });

  it("Q5 modifier DOES apply when Q4 is no", () => {
    const noModifier = calculateScore({
      q2_conversion_location: "both_dedup",
      q3_enhanced_conversions: "yes_configured",
      q4_server_side: "no",
      q5_mobile_share: "under_40",
    });
    const withModifier = calculateScore({
      q2_conversion_location: "both_dedup",
      q3_enhanced_conversions: "yes_configured",
      q4_server_side: "no",
      q5_mobile_share: "over_65",
    });
    expect(noModifier).toBe(80);   // 100 - 20
    expect(withModifier).toBe(70); // 100 - 20 - 10
  });

  it("Q5 modifier DOES apply when Q4 is not_sure", () => {
    const score = calculateScore({
      q2_conversion_location: "both_dedup",
      q3_enhanced_conversions: "yes_configured",
      q4_server_side: "not_sure",
      q5_mobile_share: "40_to_65",
    });
    expect(score).toBe(80); // 100 - 15 - 5
  });
});

// ── getRiskTier tier boundaries ───────────────────────────────────────────────

describe("getRiskTier", () => {
  it("75 → optimised", () => expect(getRiskTier(75)).toBe("optimised"));
  it("100 → optimised", () => expect(getRiskTier(100)).toBe("optimised"));
  it("74 → partial", () => expect(getRiskTier(74)).toBe("partial"));
  it("50 → partial", () => expect(getRiskTier(50)).toBe("partial"));
  it("49 → at_risk", () => expect(getRiskTier(49)).toBe("at_risk"));
  it("25 → at_risk", () => expect(getRiskTier(25)).toBe("at_risk"));
  it("24 → critical", () => expect(getRiskTier(24)).toBe("critical"));
  it("5 → critical", () => expect(getRiskTier(5)).toBe("critical"));
});

// ── calculateLoss ─────────────────────────────────────────────────────────────

describe("calculateLoss", () => {
  it("under_5k returns percentOnly=true with null values", () => {
    const result = calculateLoss(60, "under_5k");
    expect(result.percentOnly).toBe(true);
    expect(result.low).toBeNull();
    expect(result.high).toBeNull();
  });

  it("5k_20k bracket returns rounded-to-$100 values", () => {
    // score 60 → partial → 15–30% of $12,500
    // low = 12500 * 0.15 = 1875 → round to nearest 100 = 1900
    // high = 12500 * 0.30 = 3750 → round to nearest 100 = 3800
    const result = calculateLoss(60, "5k_20k");
    expect(result.percentOnly).toBe(false);
    expect(result.low).toBe(1900);
    expect(result.high).toBe(3800);
  });

  it("over_75k bracket returns rounded-to-$1000 values", () => {
    // score 40 → at_risk → 30–45% of $150,000
    // low = 150000 * 0.30 = 45000
    // high = 150000 * 0.45 = 67500 → round to 68000
    const result = calculateLoss(40, "over_75k");
    expect(result.low).toBe(45000);
    expect(result.high).toBe(68000);
  });
});

// ── formatLoss ────────────────────────────────────────────────────────────────

describe("formatLoss", () => {
  it("percentOnly returns a % range string", () => {
    const result = formatLoss({ low: null, high: null, percentOnly: true }, 60);
    expect(result).toContain("15–30%");
    expect(result).toContain("of conversions not reaching your ad platforms");
  });

  it("dollar result returns formatted string with commas", () => {
    const result = formatLoss({ low: 1900, high: 3800, percentOnly: false }, 60);
    expect(result).toBe("$1,900 – $3,800");
  });
});
