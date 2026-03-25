import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-surface)" }}>
      {/* ─── Hero ──────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: "linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))" }}
          >
            N
          </div>
          <span className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
            NurseAda
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Features
          </Link>
          <Link href="#about" className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            About
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: "var(--color-brand-500)",
              color: "var(--color-text-inverse)",
            }}
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{
              background: "var(--color-surface-secondary)",
              color: "var(--color-brand-700)",
              border: "1px solid var(--color-brand-200)",
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-brand-500)" }} />
            AI-Powered Healthcare — Available 24/7
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
          >
            Your Personal{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-brand-500), var(--color-brand-300))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Healthcare Companion
            </span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Get instant symptom analysis, medication management, herbal remedy recommendations,
            and appointment coordination — all powered by AI, designed for Nigeria and Africa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-2xl text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600))",
                color: "var(--color-text-inverse)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              Start a Consultation
            </Link>
            <Link
              href="#features"
              className="px-8 py-3.5 rounded-2xl text-base font-medium transition-all"
              style={{
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* ─── Features Grid ──────────────────────────── */}
        <section id="features" className="w-full max-w-5xl mt-24 mb-16 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {[
            {
              icon: "🩺",
              title: "Symptom Analysis",
              desc: "AI-driven symptom triage with differential diagnosis and severity assessment.",
            },
            {
              icon: "🌿",
              title: "Herbal Remedies",
              desc: "Evidence-based herbal and natural remedy recommendations with local names.",
            },
            {
              icon: "💊",
              title: "Medication Management",
              desc: "Dosage reminders, drug interaction alerts, and affordable alternatives.",
            },
            {
              icon: "📅",
              title: "Appointments",
              desc: "Find nearby clinics and book appointments seamlessly.",
            },
            {
              icon: "🚨",
              title: "Emergency Detection",
              desc: "Red-flag symptom escalation with emergency service direct connect.",
            },
            {
              icon: "📚",
              title: "Health Education",
              desc: "Localized health content in English, Pidgin, Hausa, Yoruba, and Igbo.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl transition-all hover:scale-[1.02]"
              style={{
                background: "var(--color-surface-secondary)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </section>
      </main>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer
        className="text-center py-8 text-sm"
        style={{ color: "var(--color-text-muted)", borderTop: "1px solid var(--color-border)" }}
      >
        <p>© 2026 NurseAda. AI-powered healthcare for everyone.</p>
        <p className="mt-1" style={{ fontSize: "0.75rem" }}>
          NurseAda provides health information only and does not replace professional medical advice.
        </p>
      </footer>
    </div>
  );
}
