"use client";

import { useState, useEffect, useCallback } from "react";
import { Pill, Bell, AlertCircle, Plus, Trash2, Search, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ drugName: "", dosage: "", frequency: "Once daily", time: "08:00" });
  const [savingReminder, setSavingReminder] = useState(false);

  const [drug1, setDrug1] = useState("");
  const [drug2, setDrug2] = useState("");
  const [interactionResult, setInteractionResult] = useState<string | null>(null);
  const [interactionWarning, setInteractionWarning] = useState<string>("none");
  const [isChecking, setIsChecking] = useState(false);

  const supabase = createClient();

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || "mock_token";
  }, [supabase]);

  // Load reminders from API
  const fetchReminders = useCallback(async () => {
    setLoadingReminders(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/medications/reminders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReminders(data.reminders || []);
      }
    } catch (err) {
      console.error("Failed to fetch reminders:", err);
    } finally {
      setLoadingReminders(false);
    }
  }, [getToken]);

  useEffect(() => { fetchReminders(); }, [fetchReminders]);

  const createReminder = async () => {
    if (!formData.drugName.trim() || !formData.dosage.trim()) return;
    setSavingReminder(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/medications/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ drugName: "", dosage: "", frequency: "Once daily", time: "08:00" });
        fetchReminders();
      }
    } catch (err) {
      console.error("Failed to create reminder:", err);
    } finally {
      setSavingReminder(false);
    }
  };

  const toggleReminder = async (id: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/medications/reminders/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: data.is_active } : r)));
      }
    } catch (err) {
      console.error("Failed to toggle reminder:", err);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const token = await getToken();
      await fetch(`${API_BASE_URL}/medications/reminders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete reminder:", err);
    }
  };

  const checkInteractions = async () => {
    if (!drug1.trim() || !drug2.trim()) return;
    setIsChecking(true);
    setInteractionResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/medications/check-interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugs: [drug1.trim(), drug2.trim()] }),
      });
      if (res.ok) {
        const data = await res.json();
        setInteractionResult(data.summary);
        setInteractionWarning(data.warning_level || "none");
      }
    } catch {
      setInteractionResult("⚠️ Error connecting to the server. Please ensure the backend is running.");
      setInteractionWarning("high");
    } finally {
      setIsChecking(false);
    }
  };

  const warningColors: Record<string, { bg: string; border: string; text: string }> = {
    none: { bg: "#ecfdf5", border: "#6ee7b7", text: "#065f46" },
    low: { bg: "#ecfdf5", border: "#6ee7b7", text: "#065f46" },
    moderate: { bg: "#fffbeb", border: "#fde68a", text: "#92400e" },
    high: { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b" },
    critical: { bg: "#fef2f2", border: "#f87171", text: "#7f1d1d" },
    unknown: { bg: "#f3f4f6", border: "#d1d5db", text: "#374151" },
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
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
            style={{
              background: "var(--color-brand-500)",
              color: "var(--color-text-inverse)",
            }}
          >
            <Plus size={16} />
            Add Reminder
          </button>

          {/* ─── Add Reminder Form ─────────────── */}
          {showForm && (
            <div
              className="p-5 rounded-2xl space-y-4"
              style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border)" }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>New Reminder</h3>
                <button onClick={() => setShowForm(false)}>
                  <X size={16} style={{ color: "var(--color-text-muted)" }} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Drug name" value={formData.drugName} onChange={(e) => setFormData({ ...formData, drugName: e.target.value })} className="px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)", outline: "none" }} />
                <input type="text" placeholder="Dosage (e.g. 500mg)" value={formData.dosage} onChange={(e) => setFormData({ ...formData, dosage: e.target.value })} className="px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)", outline: "none" }} />
                <select value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })} className="px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)", outline: "none" }}>
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>As needed</option>
                </select>
                <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)", outline: "none" }} />
              </div>
              <button onClick={createReminder} disabled={savingReminder || !formData.drugName.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40" style={{ background: "var(--color-brand-500)", color: "var(--color-text-inverse)" }}>
                {savingReminder ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Save Reminder
              </button>
            </div>
          )}

          {loadingReminders ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin" style={{ color: "var(--color-brand-500)" }} />
            </div>
          ) : reminders.length === 0 ? (
            <div className="text-center py-12">
              <Pill size={40} style={{ color: "var(--color-text-muted)", margin: "0 auto 12px" }} />
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No medication reminders yet. Add one to get started!</p>
            </div>
          ) : (
            reminders.map((reminder) => (
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
                  <input type="checkbox" checked={reminder.isActive} onChange={() => toggleReminder(reminder.id)} className="sr-only" />
                  <div className="w-10 h-5 rounded-full transition-all" style={{ background: reminder.isActive ? "var(--color-brand-500)" : "var(--color-border)" }}>
                    <div className="w-4 h-4 rounded-full bg-white transition-transform mt-0.5" style={{ transform: reminder.isActive ? "translateX(22px)" : "translateX(2px)" }} />
                  </div>
                </label>
                <button onClick={() => deleteReminder(reminder.id)} className="p-2 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--color-error)" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
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
              Enter two medications to check for potential interactions using AI-powered analysis.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" value={drug1} onChange={(e) => setDrug1(e.target.value)} placeholder="First medication" className="px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)", outline: "none" }} />
              <input type="text" value={drug2} onChange={(e) => setDrug2(e.target.value)} placeholder="Second medication" className="px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)", outline: "none" }} />
            </div>
            <button onClick={checkInteractions} disabled={!drug1.trim() || !drug2.trim() || isChecking} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40" style={{ background: "var(--color-brand-500)", color: "var(--color-text-inverse)" }}>
              {isChecking ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Check Interactions
            </button>
          </div>

          {interactionResult && (
            <div
              className="p-4 rounded-2xl text-sm whitespace-pre-wrap"
              style={{
                background: warningColors[interactionWarning]?.bg ?? warningColors.unknown.bg,
                border: `1px solid ${warningColors[interactionWarning]?.border ?? warningColors.unknown.border}`,
                color: warningColors[interactionWarning]?.text ?? warningColors.unknown.text,
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
