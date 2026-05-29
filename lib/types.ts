export interface LeadFormData {
  firstName: string;
  email: string;
  company: string;
  website: string;
}

export interface SubmitLeadPayload {
  // Lead form data
  firstName: string;
  email: string;
  company: string;
  website: string;
  // All 7 answers
  q1_platform: string;
  q2_conversion_location: string;
  q3_enhanced_conversions: string;
  q4_server_side: string;
  q5_mobile_share: string;
  q6_pmax: string;
  q7_spend_bracket: string;
  // Calculated fields
  signal_score: number;
  risk_tier: string;
  estimated_loss_low: number | null;
  estimated_loss_high: number | null;
  // UTMs
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
}
