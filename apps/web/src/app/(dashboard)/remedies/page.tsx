"use client";

import { useState, useEffect } from "react";
import { Search, Leaf, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface Remedy {
  id: string;
  name: string;
  localNames: Record<string, string>;
  conditions: string[];
  preparation: string;
  evidenceLevel: string;
  warnings: string;
}

export default function RemediesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.getHerbalCatalog()
      .then(data => setRemedies(data.remedies || []))
      .catch(err => console.error("Error fetching catalog:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = remedies.filter(
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
        {isLoading && (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin text-brand-500" size={32} />
          </div>
        )}
        {!isLoading && filtered.map((remedy) => {
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

        {!isLoading && filtered.length === 0 && (
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
