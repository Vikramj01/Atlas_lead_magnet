export default function Home() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div
        className="rounded-2xl border px-10 py-12"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <p
          className="mb-3 text-sm font-semibold uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          Atlas by ViMi Digital
        </p>
        <h1
          className="mb-4 text-3xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Signal Gap Calculator
        </h1>
        <p
          className="max-w-sm text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          Coming soon — a self-assessment tool that scores your conversion
          signal architecture in under 3 minutes.
        </p>
      </div>
    </div>
  );
}
