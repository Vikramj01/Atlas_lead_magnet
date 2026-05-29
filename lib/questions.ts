export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  question: string;
  subtext?: string;
  contextNote: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: "q1_platform",
    question: "What platform powers your online store or lead generation site?",
    contextNote:
      "Your platform determines how conversion events are typically implemented — and what the most common gaps look like.",
    options: [
      { label: "Salesforce Commerce Cloud (SFCC / Demandware)", value: "sfcc" },
      { label: "Shopify or Shopify Plus", value: "shopify" },
      { label: "Magento / Adobe Commerce", value: "magento" },
      { label: "Custom built (React, Next.js, etc.)", value: "custom" },
      { label: "Other / Not sure", value: "other" },
    ],
  },
  {
    id: "q2_conversion_location",
    question: "Where does your purchase or lead conversion event fire?",
    contextNote:
      "This is the single biggest variable in conversion signal accuracy. Most teams are on option 2 and believe the job is done.",
    options: [
      { label: "On the buy / submit button click", value: "button_click" },
      {
        label: "On the order confirmation or thank you page (client-side)",
        value: "thank_you_page",
      },
      {
        label:
          "Server-side from the commerce or CRM platform, independent of the browser",
        value: "server_side_only",
      },
      {
        label: "Both client-side and server-side, with deduplication",
        value: "both_dedup",
      },
      { label: "I am not sure", value: "not_sure" },
    ],
  },
  {
    id: "q3_enhanced_conversions",
    question: "Do you have Enhanced Conversions configured in Google Ads?",
    subtext:
      "Enhanced Conversions sends hashed first-party data (email, phone) alongside the conversion hit to improve Google's match rate.",
    contextNote:
      "Without Enhanced Conversions, Google cannot reliably match your conversions back to real users — which directly limits Smart Bidding accuracy.",
    options: [
      { label: "Yes, it is configured and verified", value: "yes_configured" },
      { label: "No, we have not set it up", value: "no" },
      { label: "I am not sure", value: "not_sure" },
    ],
  },
  {
    id: "q4_server_side",
    question:
      "Is there a server-side tagging layer sending events to Google and Meta independently of the user's browser?",
    subtext:
      "Server-side GTM or equivalent — events routed through your own domain rather than fired by browser JavaScript.",
    contextNote:
      "Client-side tags are blocked by ad blockers and subject to Safari's 7-day cookie limit. Server-side tagging is the fix — and the gap between the two is measurable in conversion volume.",
    options: [
      { label: "Yes, we have a server-side container running", value: "yes" },
      { label: "No, everything fires client-side", value: "no" },
      { label: "I am not sure", value: "not_sure" },
    ],
  },
  {
    id: "q5_mobile_share",
    question: "What share of your site traffic arrives on mobile devices?",
    contextNote:
      "Mobile share matters because iOS and Safari dominate in most high-income markets. Safari's privacy restrictions actively reduce the reliability of client-side conversion tracking.",
    options: [
      { label: "Under 40%", value: "under_40" },
      { label: "40% to 65%", value: "40_to_65" },
      { label: "Over 65%", value: "over_65" },
    ],
  },
  {
    id: "q6_pmax",
    question:
      "Are you currently running Performance Max campaigns in Google Ads?",
    contextNote:
      "Performance Max has no manual targeting levers. Its optimisation is entirely driven by the conversion signals it receives. Signal gaps hit PMax harder than any other campaign type.",
    options: [
      {
        label: "Yes, PMax is a significant part of our spend",
        value: "yes_significant",
      },
      { label: "Yes, but only a small portion", value: "yes_small" },
      { label: "No, we are not running PMax", value: "no" },
      { label: "I am not sure", value: "not_sure" },
    ],
  },
  {
    id: "q7_spend_bracket",
    question: "What is your approximate monthly Google Ads spend?",
    contextNote:
      "We use this to calibrate the estimated cost of your signal gaps. Higher spend means the same percentage loss translates to a larger absolute number.",
    options: [
      { label: "Under $5,000", value: "under_5k" },
      { label: "$5,000 – $20,000", value: "5k_20k" },
      { label: "$20,000 – $75,000", value: "20k_75k" },
      { label: "Over $75,000", value: "over_75k" },
    ],
  },
];
