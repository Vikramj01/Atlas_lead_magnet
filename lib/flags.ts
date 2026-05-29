import { calculateScore } from "./scoring";

export interface Flag {
  headline: string;
  body: string;
}

const Q2_FLAGS: Record<string, Flag> = {
  button_click: {
    headline: "Your conversion event fires before the sale is confirmed.",
    body: "A button click registers as a conversion before payment clears, inventory is checked, or the order is written to your backend. This creates ghost conversions that train your bidding algorithms on false signals.",
  },
  thank_you_page: {
    headline: "Your thank you page tracking has a reliability ceiling.",
    body: "By the time the page loads, the order is real — but the tag firing is not guaranteed. Tab closures, ad blockers, and mobile connection drops mean a meaningful share of confirmed orders never reach Google or Meta as a measured conversion.",
  },
  server_side_only: {
    headline: "Server-side without client-side loses session attribution context.",
    body: "Server-side hits are reliable, but without a paired client-side hit, Google receives the conversion without the session and channel context needed to attribute it accurately. A dual-layer setup with deduplication is the complete architecture.",
  },
  not_sure: {
    headline: "Your conversion event location is unverified.",
    body: "Not knowing where your purchase events fire makes it impossible to assess signal reliability. This is the first thing to verify — and it is often where the largest gaps are found.",
  },
};

const ENHANCED_CONVERSIONS_FLAG: Flag = {
  headline: "Enhanced Conversions is not configured.",
  body: "Without hashed first-party data attached to your conversion hits, Google cannot reliably match your conversions back to real users. This directly limits the accuracy of Smart Bidding and makes it harder to find lookalike audiences.",
};

const SERVER_SIDE_FLAG_STANDARD: Flag = {
  headline: "All conversion signals are exposed to client-side blocking.",
  body: "Tags that fire in the browser can be intercepted by ad blockers or expire due to Safari's cookie restrictions. A server-side layer running on your own domain bypasses both — and is the standard for any team spending seriously on paid media.",
};

const SERVER_SIDE_FLAG_HIGH_MOBILE: Flag = {
  headline: "High mobile traffic with no server-side layer is a significant signal gap.",
  body: "With over 65% mobile traffic, a large portion of your audience is likely on iOS and Safari. Safari caps analytics cookies set by JavaScript at 7 days — meaning any customer who takes more than a week to convert has a broken attribution chain by the time they buy. Server-side tagging on a first-party subdomain is the fix.",
};

const PMAX_FLAG: Flag = {
  headline: "Performance Max is your most signal-sensitive campaign type.",
  body: "PMax has no manual targeting levers — it relies entirely on the conversion signals you feed it to decide who to bid for across Search, Shopping, Display, YouTube, and Gmail simultaneously. At your current signal quality level, PMax is optimising toward an incomplete picture of your best customers.",
};

export function generateFlags(answers: Record<string, string>): Flag[] {
  const flags: Flag[] = [];

  // Flag 1 — Conversion event source
  const q2 = answers.q2_conversion_location;
  if (q2 !== "both_dedup" && q2 in Q2_FLAGS) {
    flags.push(Q2_FLAGS[q2]);
  }

  // Flag 2 — Enhanced Conversions
  if (answers.q3_enhanced_conversions !== "yes_configured") {
    flags.push(ENHANCED_CONVERSIONS_FLAG);
  }

  // Flag 3 — Server-side tagging
  if (answers.q4_server_side !== "yes") {
    const flag =
      answers.q5_mobile_share === "over_65"
        ? SERVER_SIDE_FLAG_HIGH_MOBILE
        : SERVER_SIDE_FLAG_STANDARD;
    flags.push(flag);
  }

  // Flag 4 — Performance Max (only if significant spend on PMax AND score < 70)
  if (answers.q6_pmax === "yes_significant" && calculateScore(answers) < 70) {
    flags.push(PMAX_FLAG);
  }

  return flags;
}
