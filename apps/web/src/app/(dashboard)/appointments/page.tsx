"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Clock, Plus, Trash2 } from "lucide-react";

interface Appointment {
  id: string;
  clinicName: string;
  reason: string;
  date: string;
  time: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<"mine" | "find">("mine");
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      clinicName: "Lagos General Hospital",
      reason: "Follow-up consultation",
      date: "2026-04-02",
      time: "10:00",
      status: "requested",
    },
  ]);

  const statusColors: Record<string, { bg: string; text: string }> = {
    requested: { bg: "#fef3c7", text: "#92400e" },
    confirmed: { bg: "#d1fae5", text: "#065f46" },
    completed: { bg: "#e0e7ff", text: "#3730a3" },
    cancelled: { bg: "#fef2f2", text: "#991b1b" },
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a))
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
          📅 Appointments
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Manage your appointments and find nearby clinics.
        </p>
      </div>

      {/* ─── Tabs ─────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: "var(--color-surface-secondary)" }}>
        {[
          { id: "mine" as const, label: "My Appointments" },
          { id: "find" as const, label: "Find a Clinic" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? "var(--color-surface)" : "transparent",
              color: tab === t.id ? "var(--color-text-primary)" : "var(--color-text-muted)",
              boxShadow: tab === t.id ? "var(--shadow-sm)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── My Appointments ──────────────────── */}
      {tab === "mine" && (
        <div className="space-y-4">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
            style={{
              background: "var(--color-brand-500)",
              color: "var(--color-text-inverse)",
            }}
          >
            <Plus size={16} />
            Book Appointment
          </button>

          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 rounded-2xl"
              style={{
                background: "var(--color-surface-secondary)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
                    {apt.clinicName}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                    {apt.reason}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                  style={{
                    background: statusColors[apt.status]?.bg,
                    color: statusColors[apt.status]?.text,
                  }}
                >
                  {apt.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                <span className="flex items-center gap-1">
                  <CalendarDays size={14} />
                  {apt.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {apt.time}
                </span>
              </div>
              {apt.status === "requested" && (
                <button
                  onClick={() => cancelAppointment(apt.id)}
                  className="mt-3 flex items-center gap-1 text-xs font-medium transition-all hover:opacity-70"
                  style={{ color: "var(--color-error)" }}
                >
                  <Trash2 size={14} />
                  Cancel
                </button>
              )}
            </div>
          ))}

          {appointments.length === 0 && (
            <div className="text-center py-12">
              <CalendarDays size={48} className="mx-auto mb-4" style={{ color: "var(--color-text-muted)" }} />
              <p style={{ color: "var(--color-text-secondary)" }}>No appointments yet.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── Find a Clinic ────────────────────── */}
      {tab === "find" && (
        <div
          className="p-8 rounded-2xl text-center"
          style={{
            background: "var(--color-surface-secondary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <MapPin size={48} className="mx-auto mb-4" style={{ color: "var(--color-brand-500)" }} />
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
          >
            Clinic Directory
          </h3>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            The clinic directory will be available once the knowledge service is connected.
            Clinics are stored in NurseAda&apos;s own database and seeded from curated data.
          </p>
        </div>
      )}
    </div>
  );
}
