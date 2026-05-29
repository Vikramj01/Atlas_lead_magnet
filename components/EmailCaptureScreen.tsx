"use client";

import { useState } from "react";
import { LeadFormData } from "@/lib/types";
import { isValidEmail, isWorkEmail } from "@/lib/validateEmail";

interface EmailCaptureScreenProps {
  onSubmit: (data: LeadFormData) => void;
  isSubmitting?: boolean;
  serverError?: string;
}

interface FormErrors {
  firstName?: string;
  email?: string;
  company?: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "12px 16px",
  color: "var(--text-primary)",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "var(--text-secondary)",
  marginBottom: "6px",
};

const errorStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  color: "#E05C5C",
  marginTop: "4px",
};

export default function EmailCaptureScreen({
  onSubmit,
  isSubmitting = false,
  serverError,
}: EmailCaptureScreenProps) {
  const [form, setForm] = useState<LeadFormData>({
    firstName: "",
    email: "",
    company: "",
    website: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required.";
    if (!form.email.trim()) {
      errs.email = "Work email is required.";
    } else if (!isValidEmail(form.email)) {
      errs.email = "Please enter a valid email address.";
    } else if (!isWorkEmail(form.email)) {
      errs.email = "Please use your work email address.";
    }
    if (!form.company.trim()) errs.company = "Company name is required.";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  }

  function fieldStyle(name: string, hasError: boolean): React.CSSProperties {
    return {
      ...inputStyle,
      borderColor: hasError
        ? "#E05C5C"
        : focusedField === name
        ? "var(--accent)"
        : "var(--border)",
    };
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12">
      <h2
        className="mb-3"
        style={{
          fontSize: "1.75rem",
          fontWeight: 600,
          lineHeight: 1.3,
          color: "var(--text-primary)",
        }}
      >
        Your Signal Health Score is ready.
      </h2>

      <p
        className="mb-8"
        style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}
      >
        Enter your details to see your score, your risk flags, and an estimate
        of what the gaps are costing you.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* First name */}
        <div>
          <label htmlFor="firstName" style={labelStyle}>
            First name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => {
              setForm((f) => ({ ...f, firstName: e.target.value }));
              if (errors.firstName)
                setErrors((er) => ({ ...er, firstName: undefined }));
            }}
            onFocus={() => setFocusedField("firstName")}
            onBlur={() => setFocusedField(null)}
            style={fieldStyle("firstName", !!errors.firstName)}
            placeholder="Alex"
          />
          {errors.firstName && (
            <p style={errorStyle}>{errors.firstName}</p>
          )}
        </div>

        {/* Work email */}
        <div>
          <label htmlFor="email" style={labelStyle}>
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="work email"
            value={form.email}
            onChange={(e) => {
              setForm((f) => ({ ...f, email: e.target.value }));
              if (errors.email)
                setErrors((er) => ({ ...er, email: undefined }));
            }}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            style={fieldStyle("email", !!errors.email)}
            placeholder="alex@company.com"
          />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" style={labelStyle}>
            Company name
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={(e) => {
              setForm((f) => ({ ...f, company: e.target.value }));
              if (errors.company)
                setErrors((er) => ({ ...er, company: undefined }));
            }}
            onFocus={() => setFocusedField("company")}
            onBlur={() => setFocusedField(null)}
            style={fieldStyle("company", !!errors.company)}
            placeholder="Acme Pte Ltd"
          />
          {errors.company && <p style={errorStyle}>{errors.company}</p>}
        </div>

        {/* Website (optional) */}
        <div>
          <label htmlFor="website" style={labelStyle}>
            Website URL{" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
              (optional)
            </span>
          </label>
          <input
            id="website"
            type="url"
            autoComplete="url"
            value={form.website}
            onChange={(e) =>
              setForm((f) => ({ ...f, website: e.target.value }))
            }
            onFocus={() => setFocusedField("website")}
            onBlur={() => setFocusedField(null)}
            style={fieldStyle("website", false)}
            placeholder="https://yoursite.com"
          />
        </div>

        {/* Server error */}
        {serverError && (
          <p style={{ ...errorStyle, marginTop: 0 }}>{serverError}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
          style={{
            background: isSubmitting
              ? "rgba(0,229,160,0.4)"
              : "var(--accent)",
            color: "#0A0A0F",
            fontWeight: 600,
            padding: "14px 28px",
            borderRadius: "8px",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "1rem",
            marginTop: "4px",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting)
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent-hover)";
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting)
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent)";
          }}
        >
          {isSubmitting ? "Saving your results…" : "Show me my score →"}
        </button>

        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
          No spam. Your results are emailed to you immediately. ViMi Digital may
          follow up with relevant information about Atlas.
        </p>
      </form>
    </div>
  );
}
