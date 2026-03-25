const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type FetchOptions = RequestInit & {
  token?: string;
};

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...rest,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "API request failed");
  }

  return res.json();
}

// ─── Chat ──────────────────────────────────────────────
export async function sendMessage(message: string, conversationId?: string, token?: string) {
  return apiFetch<{ reply: string; conversationId: string }>("/chat", {
    method: "POST",
    body: JSON.stringify({ message, conversation_id: conversationId }),
    token,
  });
}

// ─── Herbal Catalog ────────────────────────────────────
export async function getHerbalCatalog(token?: string) {
  return apiFetch<{ remedies: unknown[] }>("/herbal/catalog", { token });
}

// ─── Medication Reminders ──────────────────────────────
export async function getMedicationReminders(token?: string) {
  return apiFetch<{ reminders: unknown[] }>("/medications/reminders", { token });
}

export async function createMedicationReminder(data: unknown, token?: string) {
  return apiFetch("/medications/reminders", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function checkDrugInteractions(drugs: string[], token?: string) {
  return apiFetch("/medications/check-interactions", {
    method: "POST",
    body: JSON.stringify({ drugs }),
    token,
  });
}

// ─── Appointments ──────────────────────────────────────
export async function getAppointments(token?: string) {
  return apiFetch<{ appointments: unknown[] }>("/appointments", { token });
}

export async function getClinics(token?: string) {
  return apiFetch<{ clinics: unknown[] }>("/appointments/clinics", { token });
}
