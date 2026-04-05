"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarDays, MapPin, Clock, Plus, Trash2, Loader2, X, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Appointment {
  id: string;
  clinic_id: string;
  clinicName: string;
  reason: string;
  date: string;
  time: string;
  status: string;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  contact: string;
  specialties: string[];
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<"mine" | "find">("mine");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingClinics, setLoadingClinics] = useState(false);

  const [showBookForm, setShowBookForm] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [bookingData, setBookingData] = useState({ reason: "", date: "", time: "09:00" });
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || "mock_token";
  }, [supabase]);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Fetch clinics
  const fetchClinics = useCallback(async () => {
    setLoadingClinics(true);
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/clinics`);
      if (res.ok) {
        const data = await res.json();
        setClinics(data.clinics || []);
      }
    } catch (err) {
      console.error("Failed to fetch clinics:", err);
    } finally {
      setLoadingClinics(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);
  useEffect(() => { if (tab === "find") fetchClinics(); }, [tab, fetchClinics]);

  const bookAppointment = async () => {
    if (!selectedClinic || !bookingData.reason.trim() || !bookingData.date) return;
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          clinic_id: selectedClinic.id,
          reason: bookingData.reason,
          date: bookingData.date,
          time: bookingData.time,
        }),
      });
      if (res.ok) {
        setShowBookForm(false);
        setSelectedClinic(null);
        setBookingData({ reason: "", date: "", time: "09:00" });
        fetchAppointments();
        setTab("mine");
      }
    } catch (err) {
      console.error("Failed to book appointment:", err);
    } finally {
      setSaving(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      const token = await getToken();
      await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    }
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    requested: { bg: "#fef3c7", text: "#92400e" },
    confirmed: { bg: "#d1fae5", text: "#065f46" },
    completed: { bg: "#e0e7ff", text: "#3730a3" },
    cancelled: { bg: "#fef2f2", text: "#991b1b" },
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin" style={{ color: "var(--color-brand-500)" }} />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays size={48} className="mx-auto mb-4" style={{ color: "var(--color-text-muted)" }} />
              <p style={{ color: "var(--color-text-secondary)" }}>No appointments yet.</p>
              <button
                onClick={() => setTab("find")}
                className="mt-4 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "var(--color-brand-500)", color: "var(--color-text-inverse)" }}
              >
                Find a Clinic
              </button>
            </div>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-2xl"
                style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
                      {apt.clinicName}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{apt.reason}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                    style={{
                      background: statusColors[apt.status]?.bg ?? "#f3f4f6",
                      color: statusColors[apt.status]?.text ?? "#374151",
                    }}
                  >
                    {apt.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  <span className="flex items-center gap-1"><CalendarDays size={14} />{apt.date}</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{apt.time}</span>
                </div>
                {apt.status === "requested" && (
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="mt-3 flex items-center gap-1 text-xs font-medium transition-all hover:opacity-70"
                    style={{ color: "var(--color-error)" }}
                  >
                    <Trash2 size={14} /> Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── Find a Clinic ────────────────────── */}
      {tab === "find" && (
        <div className="space-y-4">
          {loadingClinics ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin" style={{ color: "var(--color-brand-500)" }} />
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-12">
              <MapPin size={48} className="mx-auto mb-4" style={{ color: "var(--color-text-muted)" }} />
              <p style={{ color: "var(--color-text-secondary)" }}>No clinics found in the directory yet.</p>
            </div>
          ) : (
            clinics.map((clinic) => (
              <div
                key={clinic.id}
                className="p-5 rounded-2xl"
                style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
                      {clinic.name}
                    </h3>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                      <MapPin size={12} /> {clinic.address}
                    </p>
                    <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                      <Phone size={12} /> {clinic.contact}
                    </p>
                    {clinic.specialties.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {clinic.specialties.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "var(--color-brand-100)", color: "var(--color-brand-700)" }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => { setSelectedClinic(clinic); setShowBookForm(true); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium shrink-0"
                    style={{ background: "var(--color-brand-500)", color: "var(--color-text-inverse)" }}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))
          )}

          {/* ─── Booking Modal ─────────────────── */}
          {showBookForm && selectedClinic && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
              <div className="w-full max-w-md p-6 rounded-2xl space-y-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    Book at {selectedClinic.name}
                  </h3>
                  <button onClick={() => setShowBookForm(false)}><X size={16} style={{ color: "var(--color-text-muted)" }} /></button>
                </div>
                <input type="text" placeholder="Reason for visit" value={bookingData.reason} onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })} className="w-full px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)", outline: "none" }} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={bookingData.date} onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} className="px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)", outline: "none" }} />
                  <input type="time" value={bookingData.time} onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })} className="px-4 py-2.5 rounded-xl text-sm" style={{ background: "var(--color-surface-secondary)", border: "1px solid var(--color-border)", color: "var(--color-text-primary)", outline: "none" }} />
                </div>
                <button onClick={bookAppointment} disabled={saving || !bookingData.reason.trim() || !bookingData.date} className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40" style={{ background: "var(--color-brand-500)", color: "var(--color-text-inverse)" }}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
