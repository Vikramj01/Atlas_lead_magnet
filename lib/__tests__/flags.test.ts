import { generateFlags } from "../flags";

const baseAnswers = {
  q1_platform: "shopify",
  q2_conversion_location: "both_dedup",
  q3_enhanced_conversions: "yes_configured",
  q4_server_side: "yes",
  q5_mobile_share: "under_40",
  q6_pmax: "no",
  q7_spend_bracket: "20k_75k",
};

describe("generateFlags", () => {
  it("returns no conversion flag when both_dedup", () => {
    const flags = generateFlags(baseAnswers);
    const headlines = flags.map((f) => f.headline);
    expect(headlines).not.toContain(
      "Your conversion event fires before the sale is confirmed."
    );
    expect(headlines).not.toContain(
      "Your thank you page tracking has a reliability ceiling."
    );
  });

  it("returns correct flag headline for button_click", () => {
    const flags = generateFlags({
      ...baseAnswers,
      q2_conversion_location: "button_click",
    });
    expect(flags[0].headline).toBe(
      "Your conversion event fires before the sale is confirmed."
    );
  });

  it("returns correct flag headline for thank_you_page", () => {
    const flags = generateFlags({
      ...baseAnswers,
      q2_conversion_location: "thank_you_page",
    });
    expect(flags[0].headline).toBe(
      "Your thank you page tracking has a reliability ceiling."
    );
  });

  it("returns correct flag headline for server_side_only", () => {
    const flags = generateFlags({
      ...baseAnswers,
      q2_conversion_location: "server_side_only",
    });
    expect(flags[0].headline).toBe(
      "Server-side without client-side loses session attribution context."
    );
  });

  it("returns no enhanced conversions flag when yes_configured", () => {
    const flags = generateFlags(baseAnswers);
    expect(flags.map((f) => f.headline)).not.toContain(
      "Enhanced Conversions is not configured."
    );
  });

  it("returns enhanced conversions flag when not configured", () => {
    const flags = generateFlags({
      ...baseAnswers,
      q3_enhanced_conversions: "no",
    });
    expect(flags.map((f) => f.headline)).toContain(
      "Enhanced Conversions is not configured."
    );
  });

  it("returns no server-side flag when q4 is yes", () => {
    const flags = generateFlags(baseAnswers);
    expect(flags.map((f) => f.headline)).not.toContain(
      "All conversion signals are exposed to client-side blocking."
    );
  });

  it("returns standard server-side flag when q4 is no and mobile is not over_65", () => {
    const flags = generateFlags({
      ...baseAnswers,
      q4_server_side: "no",
      q5_mobile_share: "under_40",
    });
    expect(flags.map((f) => f.headline)).toContain(
      "All conversion signals are exposed to client-side blocking."
    );
  });

  it("returns enhanced mobile flag when q4 is no and q5 is over_65", () => {
    const flags = generateFlags({
      ...baseAnswers,
      q4_server_side: "no",
      q5_mobile_share: "over_65",
    });
    expect(flags.map((f) => f.headline)).toContain(
      "High mobile traffic with no server-side layer is a significant signal gap."
    );
  });

  it("shows PMax flag when yes_significant AND score < 70", () => {
    // button_click(-35) + no(-20) + no(-20) = score 25 < 70
    const flags = generateFlags({
      ...baseAnswers,
      q2_conversion_location: "button_click",
      q3_enhanced_conversions: "no",
      q4_server_side: "no",
      q5_mobile_share: "under_40",
      q6_pmax: "yes_significant",
    });
    expect(flags.map((f) => f.headline)).toContain(
      "Performance Max is your most signal-sensitive campaign type."
    );
  });

  it("does NOT show PMax flag when yes_significant AND score >= 70", () => {
    // both_dedup(0) + yes_configured(0) + no(-20) = score 80 >= 70
    const flags = generateFlags({
      ...baseAnswers,
      q2_conversion_location: "both_dedup",
      q3_enhanced_conversions: "yes_configured",
      q4_server_side: "no",
      q5_mobile_share: "under_40",
      q6_pmax: "yes_significant",
    });
    expect(flags.map((f) => f.headline)).not.toContain(
      "Performance Max is your most signal-sensitive campaign type."
    );
  });
});
