"use client";

import { useState } from "react";
import { Search, Leaf, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

// Sample herbal remedies (will come from API/seed data)
const SAMPLE_REMEDIES = [
  {
    id: "1",
    name: "Bitter Leaf (Vernonia amygdalina)",
    localNames: { yoruba: "Ewuro", igbo: "Onugbu", hausa: "Shuwaka" },
    conditions: ["Malaria prophylaxis", "Stomach ache", "Fever", "Diabetes support"],
    preparation: "Squeeze fresh leaves in water, sieve, and drink the extract. Can also boil leaves for 10 minutes.",
    evidenceLevel: "Moderate",
    warnings: "Not recommended during pregnancy. May interact with diabetes medications.",
  },
  {
    id: "2",
    name: "Ginger (Zingiber officinale)",
    localNames: { yoruba: "Ata ile", igbo: "Jinja", hausa: "Citta" },
    conditions: ["Nausea", "Inflammation", "Cold & flu", "Digestive issues"],
    preparation: "Grate fresh ginger root, steep in hot water for 5-10 minutes. Add honey to taste.",
    evidenceLevel: "Strong",
    warnings: "Large doses may cause heartburn. May interact with blood-thinning medications.",
  },
  {
    id: "3",
    name: "Moringa (Moringa oleifera)",
    localNames: { yoruba: "Ewe igbale", igbo: "Okwe oyibo", hausa: "Zogale" },
    conditions: ["Nutritional deficiency", "Fatigue", "Immune support", "Blood sugar regulation"],
    preparation: "Dry leaves and grind to powder. Add 1 teaspoon to meals, smoothies, or warm water.",
    evidenceLevel: "Strong",
    warnings: "May lower blood pressure. Avoid during pregnancy in large quantities.",
  },
  {
    id: "4",
    name: "Neem (Azadirachta indica)",
    localNames: { yoruba: "Dongoyaro", igbo: "Dogonyaro", hausa: "Darbejiya" },
    conditions: ["Skin infections", "Malaria", "Blood purification", "Dental hygiene"],
    preparation: "Boil leaves for 15 minutes, let cool, and drink. For skin, apply leaf paste directly.",
    evidenceLevel: "Moderate",
    warnings: "Do not use during pregnancy. Can cause liver damage in high doses.",
  },
  {
    id: "5",
    name: "Turmeric (Curcuma longa)",
    localNames: { yoruba: "Ata ile pupa", igbo: "Nkwu nkwu", hausa: "Gangamau" },
    conditions: ["Inflammation", "Joint pain", "Digestive health", "Immune support"],
    preparation: "Mix 1/2 teaspoon turmeric powder in warm milk or water. Add black pepper for better absorption.",
    evidenceLevel: "Strong",
    warnings: "May interact with blood thinners. Excessive use may cause stomach upset.",
  },
];

export default function RemediesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = SAMPLE_REMEDIES.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.conditions.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* ─── Header ───────────────────────────── */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          🌿 Herbal & Natural Remedies
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Evidence-based traditional remedies with local names and preparation guides.
        </p>
      </div>

      {/* ─── Search ───────────────────────────── */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--color-text-muted)" }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or condition (e.g., malaria, nausea)..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm"
          style={{
            background: "var(--color-surface-secondary)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-primary)",
            outline: "none",
          }}
        />
      </div>

      {/* ─── Remedy Cards ─────────────────────── */}
      <div className="space-y-4">
        {filtered.map((remedy) => {
          const isExpanded = expandedId === remedy.id;
          return (
            <div
              key={remedy.id}
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: "var(--color-surface-secondary)",
                border: "1px solid var(--color-border)",
              }}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : remedy.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--color-brand-100)", color: "var(--color-brand-700)" }}
                  >
                    <Leaf size={20} />
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {remedy.name}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {remedy.conditions.join(" • ")}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={18} style={{ color: "var(--color-text-muted)" }} />
                ) : (
                  <ChevronDown size={18} style={{ color: "var(--color-text-muted)" }} />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 space-y-4">
                  {/* Local Names */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-muted)" }}>
                      Local Names
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(remedy.localNames).map(([lang, name]) => (
                        <span
                          key={lang}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ background: "var(--color-brand-100)", color: "var(--color-brand-700)" }}
                        >
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}: {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Preparation */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-muted)" }}>
                      Preparation
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
                      {remedy.preparation}
                    </p>
                  </div>

                  {/* Evidence Level */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                      Evidence:
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: remedy.evidenceLevel === "Strong" ? "#d1fae5" : "#fef3c7",
                        color: remedy.evidenceLevel === "Strong" ? "#065f46" : "#92400e",
                      }}
                    >
                      {remedy.evidenceLevel}
                    </span>
                  </div>

                  {/* Warnings */}
                  <div
                    className="flex items-start gap-2 p-3 rounded-xl text-sm"
                    style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                  >
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: "var(--color-warning)" }} />
                    <p style={{ color: "#991b1b" }}>{remedy.warnings}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Leaf size={48} className="mx-auto mb-4" style={{ color: "var(--color-text-muted)" }} />
            <p style={{ color: "var(--color-text-secondary)" }}>No remedies found for &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </div>

      {/* ─── Disclaimer ──────────────────────── */}
      <div
        className="mt-8 p-4 rounded-xl text-xs text-center"
        style={{ background: "var(--color-surface-secondary)", color: "var(--color-text-muted)" }}
      >
        ⚠️ These remedies are for informational purposes only. Always consult a healthcare professional before use,
        especially if you are pregnant, breastfeeding, or on medication.
      </div>
    </div>
  );
}
