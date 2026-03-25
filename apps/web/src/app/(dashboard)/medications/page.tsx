"use client";

import { useState } from "react";
import { Pill, Bell, AlertCircle, Plus, Trash2, Search } from "lucide-react";

interface Reminder {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  time: string;
  isActive: boolean;
}

export default function MedicationsPage() {
  const [tab, setTab] = useState<"reminders" | "interactions">("reminders");
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      drugName: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "08:00",
      isActive: true,
    },
    {
      id: "2",
      drugName: "Amlodipine",
      dosage: "5mg",
      frequency: "Once daily",
      time: "09:00",
      isActive: true,
    },
  ]);
  const [drug1, setDrug1] = useState("");
  const [drug2, setDrug2] = useState("");
  const [interactionResult, setInteractionResult] = useState<string | null>(null);

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const checkInteractions = () => {
    if (!drug1.trim() || !drug2.trim()) return;
    // TODO: Wire up to FastAPI backend
    setInteractionResult(
      `⚠️ Interaction check for "${drug1}" and "${drug2}" is in scaffold mode. Once connected to the backend, this will query the CDSS drug-interaction database for real-time results.`
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* ─── Header ───────────────────────────── */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          💊 Medications
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Manage your medication reminders and check for drug interactions.
        </p>
      </div>

      {/* ─── Tabs ─────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: "var(--color-surface-secondary)" }}>
        {[
          { id: "reminders" as const, label: "My Reminders", icon: Bell },
          { id: "interactions" as const, label: "Interaction Checker", icon: AlertCircle },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? "var(--color-surface)" : "transparent",
              color: tab === t.id ? "var(--color-text-primary)" : "var(--color-text-muted)",
              boxShadow: tab === t.id ? "var(--shadow-sm)" : "none",
            }}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── Reminders Tab ────────────────────── */}
      {tab === "reminders" && (
        <div className="space-y-4">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
            style={{
              background: "var(--color-brand-500)",
              color: "var(--color-text-inverse)",
            }}
          >
            <Plus size={16} />
            Add Reminder
          </button>

          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: "var(--color-surface-secondary)",
                border: "1px solid var(--color-border)",
                opacity: reminder.isActive ? 1 : 0.5,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--color-brand-100)", color: "var(--color-brand-700)" }}
              >
                <Pill size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
                  {reminder.drugName} — {reminder.dosage}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {reminder.frequency} • {reminder.time}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminder.isActive}
                  onChange={() => toggleReminder(reminder.id)}
                  className="sr-only"
                />
                <div
                  className="w-10 h-5 rounded-full transition-all"
                  style={{
                    background: reminder.isActive ? "var(--color-brand-500)" : "var(--color-border)",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full bg-white transition-transform mt-0.5"
                    style={{
                      transform: reminder.isActive ? "translateX(22px)" : "translateX(2px)",
                    }}
                  />
                </div>
              </label>
              <button
                onClick={() => deleteReminder(reminder.id)}
                className="p-2 rounded-lg transition-all hover:opacity-70"
                style={{ color: "var(--color-error)" }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ─── Interactions Tab ─────────────────── */}
      {tab === "interactions" && (
        <div className="space-y-4">
          <div
            className="p-6 rounded-2xl space-y-4"
            style={{
              background: "var(--color-surface-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Enter two medications to check for potential interactions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={drug1}
                onChange={(e) => setDrug1(e.target.value)}
                placeholder="First medication"
                className="px-4 py-2.5 rounded-xl text-sm"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  outline: "none",
                }}
              />
              <input
                type="text"
                value={drug2}
                onChange={(e) => setDrug2(e.target.value)}
                placeholder="Second medication"
                className="px-4 py-2.5 rounded-xl text-sm"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  outline: "none",
                }}
              />
            </div>
            <button
              onClick={checkInteractions}
              disabled={!drug1.trim() || !drug2.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
              style={{
                background: "var(--color-brand-500)",
                color: "var(--color-text-inverse)",
              }}
            >
              <Search size={16} />
              Check Interactions
            </button>
          </div>

          {interactionResult && (
            <div
              className="p-4 rounded-2xl text-sm"
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                color: "#92400e",
              }}
            >
              {interactionResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
