# PRD: Atlas Signal Gap Calculator
**Product:** Lead magnet / self-assessment tool  
**Owner:** ViMi Digital / Spi3l LLC  
**Version:** 1.0  
**Status:** Ready for build  
**Deployment target:** Standalone page at `signal.vimi.digital` (or `/signal-check` path on `vimi.digital/atlas`) — architecture must support both without changes.

---

## 1. Purpose

The Signal Gap Calculator is a gated self-assessment tool that allows performance marketers to evaluate the quality of their conversion signal architecture in under 3 minutes. It produces a personalised Signal Health Score and a dollar-range estimate of monthly conversion loss. The lead capture happens before the result is shown.

**Primary goal:** Generate qualified inbound leads for Atlas diagnostics.  
**Secondary goal:** Position ViMi Digital / Atlas as the authoritative voice on conversion signal quality in Asia and the Gulf.

---

## 2. User Flow

```
Landing screen
    ↓  [Start the assessment]
Question 1 of 7
    ↓
Question 2 of 7
    ↓
...
Question 7 of 7
    ↓  [See my score]
Email capture screen
    ↓  [Send me my results]
Results screen  (Score + Risk Tier + Flags + CTA)
```

Each question occupies its own screen. No scrolling. Progress bar visible throughout. Back navigation allowed on questions. Back navigation not allowed from email capture or results.

---

## 3. Landing Screen

**Headline:**  
`Is your ad spend training Google on the wrong customers?`

**Subheadline:**  
`Answer 7 questions about your tracking setup. Get your Signal Health Score and an estimate of what the gaps are costing you each month.`

**Supporting line:**  
`Takes under 3 minutes. No login required.`

**CTA button:**  
`Start the assessment →`

**Trust signal beneath button:**  
`Used by performance marketing teams in the UAE, Singapore, and Southeast Asia.`

---

## 4. Questions

Each question screen shows:
- Progress bar (e.g. "Question 1 of 7")
- Question headline
- Answer options as selectable cards (single select)
- A one-line context note beneath the question in muted text (explains why this matters — builds credibility as the user progresses)

---

### Q1 — Platform

**Question:**  
`What platform powers your online store or lead generation site?`

**Options:**
- Salesforce Commerce Cloud (SFCC / Demandware)
- Shopify or Shopify Plus
- Magento / Adobe Commerce
- Custom built (React, Next.js, etc.)
- Other / Not sure

**Context note:**  
`Your platform determines how conversion events are typically implemented — and what the most common gaps look like.`

**Scoring:** Q1 is a segmentation input only. It does not affect the score but it personalises the output flags.

---

### Q2 — Conversion event location *(highest weight)*

**Question:**  
`Where does your purchase or lead conversion event fire?`

**Options:**
- On the buy / submit button click
- On the order confirmation or thank you page (client-side)
- Server-side from the commerce or CRM platform, independent of the browser
- Both client-side and server-side, with deduplication
- I am not sure

**Context note:**  
`This is the single biggest variable in conversion signal accuracy. Most teams are on option 2 and believe the job is done.`

**Score impact:**
| Answer | Score deduction |
|---|---|
| Button click | −35 |
| Thank you page only | −20 |
| Server-side only | −5 |
| Both with deduplication | 0 |
| Not sure | −25 |

---

### Q3 — Enhanced Conversions

**Question:**  
`Do you have Enhanced Conversions configured in Google Ads?`

*Subtext beneath question:* `Enhanced Conversions sends hashed first-party data (email, phone) alongside the conversion hit to improve Google's match rate.`

**Options:**
- Yes, it is configured and verified
- No, we have not set it up
- I am not sure

**Context note:**  
`Without Enhanced Conversions, Google cannot reliably match your conversions back to real users — which directly limits Smart Bidding accuracy.`

**Score impact:**
| Answer | Score deduction |
|---|---|
| Yes, configured | 0 |
| No | −20 |
| Not sure | −15 |

---

### Q4 — Server-side tagging

**Question:**  
`Is there a server-side tagging layer sending events to Google and Meta independently of the user's browser?`

*Subtext beneath question:* `Server-side GTM or equivalent — events routed through your own domain rather than fired by browser JavaScript.`

**Options:**
- Yes, we have a server-side container running
- No, everything fires client-side
- I am not sure

**Context note:**  
`Client-side tags are blocked by ad blockers and subject to Safari's 7-day cookie limit. Server-side tagging is the fix — and the gap between the two is measurable in conversion volume.`

**Score impact:**
| Answer | Score deduction |
|---|---|
| Yes | 0 |
| No | −20 |
| Not sure | −15 |

---

### Q5 — Mobile traffic share

**Question:**  
`What share of your site traffic arrives on mobile devices?`

**Options:**
- Under 40%
- 40% to 65%
- Over 65%

**Context note:**  
`Mobile share matters because iOS and Safari dominate in most high-income markets. Safari's privacy restrictions actively reduce the reliability of client-side conversion tracking.`

**Score impact (modifier applied to Q4 deduction only):**  
If Q4 answer was "No" or "Not sure":
| Mobile share | Additional deduction |
|---|---|
| Under 40% | −0 |
| 40–65% | −5 |
| Over 65% | −10 |

If Q4 answer was "Yes": no modifier applied.

---

### Q6 — Performance Max

**Question:**  
`Are you currently running Performance Max campaigns in Google Ads?`

**Options:**
- Yes, PMax is a significant part of our spend
- Yes, but only a small portion
- No, we are not running PMax
- I am not sure

**Context note:**  
`Performance Max has no manual targeting levers. Its optimisation is entirely driven by the conversion signals it receives. Signal gaps hit PMax harder than any other campaign type.`

**Score impact:**
| Answer | Score modifier |
|---|---|
| Yes, significant | PMax flag activated (see section 7) |
| Yes, small portion | PMax flag activated (lighter version) |
| No | No modifier |
| Not sure | No modifier |

---

### Q7 — Monthly ad spend *(qualification signal)*

**Question:**  
`What is your approximate monthly Google Ads spend?`

**Options:**
- Under $5,000
- $5,000 – $20,000
- $20,000 – $75,000
- Over $75,000

**Context note:**  
`We use this to calibrate the estimated cost of your signal gaps. Higher spend means the same percentage loss translates to a larger absolute number.`

**Score impact:** None. Used exclusively for dollar estimate calculation and lead qualification routing in the results output.

---

## 5. Email Capture Screen

Shown immediately after Q7, before the results are revealed.

**Headline:**  
`Your Signal Health Score is ready.`

**Subheadline:**  
`Enter your details to see your score, your risk flags, and an estimate of what the gaps are costing you.`

**Fields:**
- First name (required)
- Work email (required, validated — no Gmail/Yahoo/Hotmail accepted)
- Company name (required)
- Website URL (optional)

**CTA button:**  
`Show me my score →`

**Fine print:**  
`No spam. Your results are emailed to you immediately. ViMi Digital may follow up with relevant information about Atlas.`

**Behaviour:**  
On submit — validate fields, store lead data, reveal results screen. Simultaneously send results to the email address provided (plain text email, see section 9).

---

## 6. Scoring Algorithm

**Base score:** 100  
**Deductions applied** based on Q2, Q3, Q4, and Q5 answers per the tables above.  
**Minimum score:** 5 (floor — never display zero or negative)

```
final_score = max(5, 100 - Q2_deduction - Q3_deduction - Q4_deduction - Q5_modifier)
```

**Risk tiers:**

| Score range | Tier label | Tier colour |
|---|---|---|
| 75–100 | Optimised | #00E5A0 (mint) |
| 50–74 | Partial Coverage | #F5A623 (amber) |
| 25–49 | At Risk | #E05C5C (red-orange) |
| 5–24 | Critical | #CC2222 (red) |

---

## 7. Results Screen

### 7a. Score display

Large circular or arc score display — number prominent, e.g. `62 / 100`.  
Tier label displayed beneath: e.g. `PARTIAL COVERAGE`.  
One-line tier description beneath label (see below).

**Tier descriptions:**
- Optimised: `Your signal architecture is above average. Targeted refinements could still improve bidding precision.`
- Partial Coverage: `Gaps in your signal setup are likely costing you measurable campaign performance each month.`
- At Risk: `Your ad platforms are making budget decisions on significantly incomplete data.`
- Critical: `Fundamental tracking gaps are actively degrading your campaign results. This needs to be addressed before further spend increases.`

---

### 7b. Estimated monthly signal loss

Displayed as a dollar range beneath the score.

**Calculation logic:**

Monthly spend bracket multiplied by estimated signal loss percentage, multiplied by assumed conversion impact factor:

| Spend bracket | Signal loss % used | Display range |
|---|---|---|
| Under $5k | Based on score | Low dollar impact — show as % only |
| $5k–$20k | Based on score | $X00 – $X,000 |
| $20k–$75k | Based on score | $X,000 – $XX,000 |
| Over $75k | Based on score | $XX,000 – $XXX,000 |

**Signal loss % by score:**
| Score range | Signal loss % |
|---|---|
| 75–100 | 5–10% |
| 50–74 | 15–30% |
| 25–49 | 30–45% |
| 5–24 | 45–60% |

**Display format:**  
`Estimated monthly signal loss: $4,200 – $9,800`  
Subtext: `Based on your spend level and the gaps identified below. This is an estimate — your actual figure depends on mobile traffic mix, ad blocker rates, and iOS share in your market.`

For the Under $5k bracket, show:  
`Estimated signal gap: 15–30% of conversions not reaching your ad platforms.`

---

### 7c. Risk flags

Display 2–4 personalised flags based on answers. Each flag is a card with a short headline and a 2-sentence explanation.

**Flag generation logic:**

**Flag: Conversion Event Source** — show if Q2 ≠ "Both with deduplication"

- *Button click selected:*  
  Headline: `Your conversion event fires before the sale is confirmed.`  
  Body: `A button click registers as a conversion before payment clears, inventory is checked, or the order is written to your backend. This creates ghost conversions that train your bidding algorithms on false signals.`

- *Thank you page only selected:*  
  Headline: `Your thank you page tracking has a reliability ceiling.`  
  Body: `By the time the page loads, the order is real — but the tag firing is not guaranteed. Tab closures, ad blockers, and mobile connection drops mean a meaningful share of confirmed orders never reach Google or Meta as a measured conversion.`

- *Server-side only selected:*  
  Headline: `Server-side without client-side loses session attribution context.`  
  Body: `Server-side hits are reliable, but without a paired client-side hit, Google receives the conversion without the session and channel context needed to attribute it accurately. A dual-layer setup with deduplication is the complete architecture.`

- *Not sure selected:*  
  Headline: `Your conversion event location is unverified.`  
  Body: `Not knowing where your purchase events fire makes it impossible to assess signal reliability. This is the first thing to verify — and it is often where the largest gaps are found.`

---

**Flag: Enhanced Conversions** — show if Q3 ≠ "Yes, configured"

Headline: `Enhanced Conversions is not configured.`  
Body: `Without hashed first-party data attached to your conversion hits, Google cannot reliably match your conversions back to real users. This directly limits the accuracy of Smart Bidding and makes it harder to find lookalike audiences.`

---

**Flag: Server-side Tagging** — show if Q4 ≠ "Yes"

- Standard version:  
  Headline: `All conversion signals are exposed to client-side blocking.`  
  Body: `Tags that fire in the browser can be intercepted by ad blockers or expire due to Safari's cookie restrictions. A server-side layer running on your own domain bypasses both — and is the standard for any team spending seriously on paid media.`

- Enhanced version (if Q5 = "Over 65%"):  
  Headline: `High mobile traffic with no server-side layer is a significant signal gap.`  
  Body: `With over 65% mobile traffic, a large portion of your audience is likely on iOS and Safari. Safari caps analytics cookies set by JavaScript at 7 days — meaning any customer who takes more than a week to convert has a broken attribution chain by the time they buy. Server-side tagging on a first-party subdomain is the fix.`

---

**Flag: Performance Max** — show if Q6 = "Yes, significant" AND score < 70

Headline: `Performance Max is your most signal-sensitive campaign type.`  
Body: `PMax has no manual targeting levers — it relies entirely on the conversion signals you feed it to decide who to bid for across Search, Shopping, Display, YouTube, and Gmail simultaneously. At your current signal quality level, PMax is optimising toward an incomplete picture of your best customers.`

---

### 7d. CTA block

**Primary CTA:**  
`Get a full signal audit →`  
Links to the Atlas diagnostic booking flow (Calendly or equivalent).

**Supporting copy beneath CTA:**  
`We audit your full tracking environment — ad platforms, analytics, and CRM — and deliver a prioritised fix list within 48 hours. One engagement. No ongoing commitment required.`

**Secondary CTA:**  
`Learn how Atlas works →`  
Links to `vimi.digital/atlas`.

---

## 8. Design System

Match the Atlas product site (`v0-atlas-product-website.vercel.app`) precisely.

### Colours
| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0A0A0F` | Page background |
| `--bg-card` | `#12121A` | Card / question container backgrounds |
| `--bg-card-hover` | `#1A1A26` | Selected answer card state |
| `--accent` | `#00E5A0` | Primary CTA buttons, progress bar fill, score arc, selected state border |
| `--accent-dim` | `rgba(0, 229, 160, 0.1)` | Selected card background tint |
| `--text-primary` | `#FFFFFF` | Headlines, answer options |
| `--text-muted` | `#6B7280` | Context notes, supporting copy, fine print |
| `--text-secondary` | `#9CA3AF` | Body text, descriptions |
| `--border` | `rgba(255,255,255,0.08)` | Card borders (default) |
| `--border-selected` | `#00E5A0` | Card border when selected |
| `--risk-optimised` | `#00E5A0` | Score display for Optimised tier |
| `--risk-partial` | `#F5A623` | Score display for Partial Coverage tier |
| `--risk-atrisk` | `#E05C5C` | Score display for At Risk tier |
| `--risk-critical` | `#CC2222` | Score display for Critical tier |

### Typography
- Font family: `Inter` (Google Fonts, same as Atlas site)
- Question headline: `font-size: 1.75rem; font-weight: 600; line-height: 1.3`
- Answer option text: `font-size: 1rem; font-weight: 500`
- Context note: `font-size: 0.875rem; font-weight: 400; color: var(--text-muted)`
- Score number: `font-size: 4rem; font-weight: 700`
- Flag headline: `font-size: 1rem; font-weight: 600`
- Flag body: `font-size: 0.875rem; font-weight: 400; color: var(--text-secondary)`

### Layout
- Max content width: `640px` centred
- Page padding: `24px` horizontal on mobile, `48px` on desktop
- Card border radius: `12px`
- Button border radius: `8px`
- Answer card padding: `16px 20px`
- Gap between answer cards: `12px`

### Progress bar
- Thin bar (`4px` height) at top of viewport
- Background: `rgba(255,255,255,0.1)`
- Fill: `var(--accent)`
- Fills proportionally: Q1 = 14%, Q2 = 28% ... Q7 = 100%
- Animate fill transition: `transition: width 0.3s ease`

### Answer cards
- Default state: `background: var(--bg-card); border: 1px solid var(--border)`
- Hover state: `background: var(--bg-card-hover); border-color: rgba(0,229,160,0.3)`
- Selected state: `background: var(--accent-dim); border-color: var(--border-selected)`
- Selecting an answer immediately enables the Next button
- Do not auto-advance — require explicit Next button click

### Buttons
- Primary CTA: `background: var(--accent); color: #0A0A0F; font-weight: 600; padding: 14px 28px`
- Hover: `background: #00CCB8` (slightly darker mint)
- Back link: plain text, `color: var(--text-muted)`, no background

### Atlas logo
- Display in top-left of every screen
- Link to `vimi.digital/atlas`
- Source: `https://v0-atlas-product-website.vercel.app/Atlas logo 1.jpeg`

---

## 9. Email Behaviour

On successful email capture and form submit:

**Immediate:** Results screen is revealed in-app (no page redirect).

**Email sent to user:** Plain text or simple HTML email containing:
- Their score and tier
- The 2–4 risk flags in brief (one sentence each)
- The dollar range estimate
- Link to book an Atlas diagnostic
- Signed: "The Atlas team at ViMi Digital"

**Lead data stored:** Name, email, company, website URL, all 7 question answers, calculated score, tier, timestamp, UTM parameters if present.

**Integration:** Store lead data to a Supabase table (`signal_calculator_leads`). Also fire a webhook or Zapier trigger to notify the ViMi team of new qualified submissions (spend > $5k).

**Work email validation:** Reject submissions from the following domains: gmail.com, yahoo.com, hotmail.com, outlook.com, icloud.com, me.com. Show inline error: `Please use your work email address.`

---

## 10. Technical Requirements

### Stack
- **Framework:** Next.js 14 (App Router) — consistent with existing v0/Vercel stack
- **Styling:** Tailwind CSS with CSS custom properties for design tokens
- **Animation:** Framer Motion for screen transitions (fade + slight upward slide between questions)
- **Form handling:** React state (no library needed for 7 questions)
- **Database:** Supabase — new table `signal_calculator_leads`
- **Email:** Resend (simple transactional email)
- **Deployment:** Vercel

### Supabase table: `signal_calculator_leads`
```sql
create table signal_calculator_leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  first_name text not null,
  email text not null,
  company text not null,
  website text,
  q1_platform text,
  q2_conversion_location text,
  q3_enhanced_conversions text,
  q4_server_side text,
  q5_mobile_share text,
  q6_pmax text,
  q7_spend_bracket text,
  signal_score integer,
  risk_tier text,
  estimated_loss_low integer,
  estimated_loss_high integer,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_country text
);
```

### URL / routing

The tool must work in two deployment modes without code changes:

**Mode A — Standalone page:**  
Deployed as root route at `signal.vimi.digital` (separate Vercel project, pointing to new subdomain)

**Mode B — Embedded path:**  
Deployed as `/signal-check` route within the existing `vimi.digital` Next.js project

Achieve this by ensuring the tool has no hard-coded domain references and all internal links use relative paths or environment variables.

### Environment variables required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_ATLAS_URL=https://vimi.digital/atlas
NEXT_PUBLIC_BOOKING_URL=https://calendly.com/mikael-mcaconsulting/30min
```

### UTM parameter capture
On page load, read and store any UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) from the URL. Pass through to the Supabase lead record at submission time.

### Meta tags (for standalone landing page mode)
```
title: "Signal Gap Calculator | Atlas by ViMi Digital"
description: "Answer 7 questions about your tracking setup. Get your Signal Health Score and see what your signal gaps are costing you each month."
og:image: /og-signal-calculator.png  (dark card with score display mock)
theme-color: #0A0A0F
```

---

## 11. Screen Transitions

Between question screens: fade out current screen (150ms), fade in next screen with 8px upward translate (200ms).  
Back navigation: same transition, reverse direction (downward translate).  
Email capture → Results: no transition animation — results appear immediately after submit success, to feel instant.

---

## 12. Mobile Behaviour

- Fully responsive. All screens must work on 375px viewport width.
- Answer cards stack vertically on mobile (same as desktop — single column always).
- Score arc on results screen should scale to 200px diameter on mobile.
- CTA buttons full width on mobile.
- Keyboard should not push content off-screen on the email capture form — use `viewport-fit=cover` and test on iOS Safari specifically.

---

## 13. Out of Scope (v1.0)

The following are explicitly excluded from this build:

- URL-based automated site scanning (crawler integration — future Atlas feature)
- Multi-language support
- A/B testing variants
- CRM integration beyond Supabase + webhook
- White-label / agency version
- Admin dashboard for viewing submissions (use Supabase dashboard directly for now)
- PDF export of results
- Social sharing of score

---

## 14. Acceptance Criteria

- [ ] All 7 question screens render correctly on desktop (1280px) and mobile (375px)
- [ ] Progress bar accurately reflects position through the flow
- [ ] Back navigation works on all question screens
- [ ] Score calculation matches the algorithm in section 6 for all answer combinations
- [ ] Risk tier label and colour render correctly for all four tiers
- [ ] Dollar estimate displays correctly for all spend bracket + score combinations
- [ ] Flag logic generates the correct flags for all answer permutations
- [ ] Work email validation rejects personal email domains
- [ ] Lead data writes to Supabase with all 7 question answers and calculated fields
- [ ] Confirmation email sends successfully via Resend
- [ ] UTM parameters are captured and stored if present in URL
- [ ] Tool loads and functions correctly on iOS Safari 16+
- [ ] Tool deploys correctly in both Mode A (subdomain) and Mode B (path) without code changes
- [ ] No Atlas or ViMi logo requests fail (images load correctly)
- [ ] Lighthouse performance score ≥ 85 on mobile

---

## 15. Content Reference

**Atlas site for design reference:**  
`https://v0-atlas-product-website.vercel.app`

**ViMi Digital site for brand reference:**  
`https://vimi.digital`

**Booking link:**  
`https://calendly.com/mikael-mcaconsulting/30min`

**Logo source:**  
`https://v0-atlas-product-website.vercel.app/Atlas logo 1.jpeg`
