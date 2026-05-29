"use server";

import { cookies } from "next/headers";
import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";
import { generateFlags } from "@/lib/flags";
import { getTierInfo } from "@/lib/scoring";
import type { SubmitLeadPayload } from "@/lib/types";

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/mikael-mcaconsulting/30min";

const QUALIFIED_SPEND_BRACKETS = new Set([
  "5k_20k",
  "20k_75k",
  "over_75k",
]);

export async function submitLead(
  payload: SubmitLeadPayload
): Promise<{ success: boolean; error?: string }> {
  // ── 1. Supabase insert ──────────────────────────────────────────────────────
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error: dbError } = await supabase
      .from("signal_calculator_leads")
      .insert({
        first_name: payload.firstName,
        email: payload.email,
        company: payload.company,
        website: payload.website || null,
        q1_platform: payload.q1_platform,
        q2_conversion_location: payload.q2_conversion_location,
        q3_enhanced_conversions: payload.q3_enhanced_conversions,
        q4_server_side: payload.q4_server_side,
        q5_mobile_share: payload.q5_mobile_share,
        q6_pmax: payload.q6_pmax,
        q7_spend_bracket: payload.q7_spend_bracket,
        signal_score: payload.signal_score,
        risk_tier: payload.risk_tier,
        estimated_loss_low: payload.estimated_loss_low,
        estimated_loss_high: payload.estimated_loss_high,
        utm_source: payload.utm_source,
        utm_medium: payload.utm_medium,
        utm_campaign: payload.utm_campaign,
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError.message);
      return {
        success: false,
        error: "Failed to save your results. Please try again.",
      };
    }
  } catch (err) {
    console.error("Supabase unexpected error:", err);
    return {
      success: false,
      error: "Failed to save your results. Please try again.",
    };
  }

  // ── 2. Resend confirmation email ────────────────────────────────────────────
  try {
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const tierInfo = getTierInfo(
        payload.risk_tier as Parameters<typeof getTierInfo>[0]
      );

      // Build flag headlines for email summary
      const answers: Record<string, string> = {
        q1_platform: payload.q1_platform,
        q2_conversion_location: payload.q2_conversion_location,
        q3_enhanced_conversions: payload.q3_enhanced_conversions,
        q4_server_side: payload.q4_server_side,
        q5_mobile_share: payload.q5_mobile_share,
        q6_pmax: payload.q6_pmax,
        q7_spend_bracket: payload.q7_spend_bracket,
      };
      const flags = generateFlags(answers);
      const flagListHtml = flags
        .slice(0, 3)
        .map((f) => `<li style="margin-bottom:8px;">${f.headline}</li>`)
        .join("");

      const lossText =
        payload.estimated_loss_low && payload.estimated_loss_high
          ? `$${payload.estimated_loss_low.toLocaleString("en-US")} – $${payload.estimated_loss_high.toLocaleString("en-US")} per month`
          : "See your full results for the estimated impact.";

      const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#0A0A0F;color:#FFFFFF;margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <p style="color:#6B7280;font-size:13px;margin-bottom:24px;">Atlas by ViMi Digital</p>

    <h1 style="font-size:24px;font-weight:700;margin-bottom:8px;color:#FFFFFF;">
      Your Signal Health Score: ${payload.signal_score}/100
    </h1>
    <p style="font-size:16px;font-weight:600;color:${tierColor(payload.risk_tier)};margin-bottom:24px;text-transform:uppercase;letter-spacing:0.08em;">
      ${tierInfo.label}
    </p>

    <p style="color:#9CA3AF;margin-bottom:8px;">Hi ${payload.firstName},</p>
    <p style="color:#9CA3AF;margin-bottom:24px;line-height:1.6;">
      ${tierInfo.description}
    </p>

    <div style="background:#12121A;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 6px;">Estimated monthly signal loss</p>
      <p style="color:#FFFFFF;font-size:20px;font-weight:700;margin:0;">${lossText}</p>
    </div>

    ${flags.length > 0 ? `
    <p style="color:#9CA3AF;font-size:14px;margin-bottom:8px;">Top gaps identified:</p>
    <ul style="color:#9CA3AF;font-size:14px;padding-left:20px;margin-bottom:28px;line-height:1.6;">
      ${flagListHtml}
    </ul>` : ""}

    <a href="${BOOKING_URL}"
       style="display:inline-block;background:#00E5A0;color:#0A0A0F;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:16px;margin-bottom:32px;">
      Book your Atlas diagnostic →
    </a>

    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin-bottom:24px;">
    <p style="color:#6B7280;font-size:13px;margin:0;">The Atlas team at ViMi Digital</p>
  </div>
</body>
</html>`;

      await resend.emails.send({
        from: "Atlas <onboarding@resend.dev>",
        to: payload.email,
        subject: `Your Signal Health Score: ${payload.signal_score}/100 — ${tierInfo.label}`,
        html: emailHtml,
      });
    }
  } catch (err) {
    // Email failure is non-critical — log but don't block
    console.error("Resend email error:", err);
  }

  // ── 3. Qualified lead webhook ───────────────────────────────────────────────
  try {
    const webhookUrl = process.env.QUALIFIED_LEAD_WEBHOOK_URL;
    if (webhookUrl && QUALIFIED_SPEND_BRACKETS.has(payload.q7_spend_bracket)) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: payload.firstName,
          email: payload.email,
          company: payload.company,
          signal_score: payload.signal_score,
          risk_tier: payload.risk_tier,
          q7_spend_bracket: payload.q7_spend_bracket,
        }),
      });
    }
  } catch (err) {
    // Webhook failure is non-critical
    console.error("Webhook error:", err);
  }

  return { success: true };
}

function tierColor(tier: string): string {
  const map: Record<string, string> = {
    optimised: "#00E5A0",
    partial: "#F5A623",
    at_risk: "#E05C5C",
    critical: "#CC2222",
  };
  return map[tier] ?? "#9CA3AF";
}
