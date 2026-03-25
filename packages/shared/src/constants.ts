export const API_ROUTES = {
  CHAT: "/chat",
  HERBAL_CATALOG: "/herbal/catalog",
  MEDICATIONS: {
    REMINDERS: "/medications/reminders",
    CHECK_INTERACTIONS: "/medications/check-interactions",
  },
  APPOINTMENTS: {
    BASE: "/appointments",
    CLINICS: "/appointments/clinics",
  },
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: {
    CHAT: "/chat",
    REMEDIES: "/remedies",
    MEDICATIONS: "/medications",
    APPOINTMENTS: "/appointments",
  },
} as const;

export const SUPPORTED_LANGUAGES = [
  "English",
  "Pidgin",
  "Yoruba",
  "Igbo",
  "Hausa",
] as const;
