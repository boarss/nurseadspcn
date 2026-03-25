// ─── User ─────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

// ─── Chat ─────────────────────────────────────────────────
export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

// ─── Remedies ─────────────────────────────────────────────
export interface LocalNames {
  yoruba?: string;
  igbo?: string;
  hausa?: string;
}

export interface HerbalRemedy {
  id: string;
  name: string;
  localNames: LocalNames;
  conditions: string[];
  preparation: string;
  evidenceLevel: "Strong" | "Moderate" | "Limited";
  warnings: string;
}

// ─── Medications ──────────────────────────────────────────
export interface MedicationReminder {
  id: string;
  user_id: string;
  drug_name: string;
  dosage: string;
  frequency: string;
  time_of_day: string;
  is_active: boolean;
  created_at: string;
}

// ─── Appointments ─────────────────────────────────────────
export type AppointmentStatus = "requested" | "confirmed" | "completed" | "cancelled";

export interface Clinic {
  id: string;
  name: string;
  address: string;
  contact?: string;
  specialties: string[];
}

export interface Appointment {
  id: string;
  user_id: string;
  clinic_id: string;
  reason: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}
