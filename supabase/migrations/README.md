# Supabase Migrations

## Applying migrations manually

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your Atlas project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste the contents of `001_create_signal_calculator_leads.sql`
6. Click **Run**

## Tables

### `signal_calculator_leads`

Stores every lead submission from the Signal Gap Calculator tool.

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key, auto-generated |
| `created_at` | timestamptz | Submission timestamp |
| `first_name` | text | Lead's first name |
| `email` | text | Work email address |
| `company` | text | Company name |
| `website` | text | Website URL (optional) |
| `q1_platform`–`q7_spend_bracket` | text | All 7 question answers |
| `signal_score` | integer | Calculated score (5–100) |
| `risk_tier` | text | optimised / partial / at_risk / critical |
| `estimated_loss_low` | integer | Lower bound dollar estimate (nullable) |
| `estimated_loss_high` | integer | Upper bound dollar estimate (nullable) |
| `utm_source`–`utm_campaign` | text | UTM parameters captured on page load |
| `ip_country` | text | Reserved for future geo enrichment |
