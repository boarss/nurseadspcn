from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


# ─── Auth ──────────────────────────────────────────────────
class UserProfile(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None


# ─── Chat ──────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str


# ─── Herbal Remedies ───────────────────────────────────────
class LocalNames(BaseModel):
    yoruba: Optional[str] = None
    igbo: Optional[str] = None
    hausa: Optional[str] = None


class HerbalRemedy(BaseModel):
    id: str
    name: str
    localNames: LocalNames
    conditions: List[str]
    preparation: str
    evidenceLevel: str
    warnings: str


class HerbalCatalogResponse(BaseModel):
    remedies: List[HerbalRemedy]


# ─── Medications ───────────────────────────────────────────
class MedicationReminderCreate(BaseModel):
    drugName: str
    dosage: str
    frequency: str
    time: str


class MedicationReminder(MedicationReminderCreate):
    id: str
    isActive: bool
    created_at: datetime


class MedicationReminderList(BaseModel):
    reminders: List[MedicationReminder]


class DrugInteractionRequest(BaseModel):
    drugs: List[str]


class DrugInteractionResponse(BaseModel):
    interactions: List[Dict[str, Any]]
    warning_level: str
    summary: str


# ─── Appointments ──────────────────────────────────────────
class Clinic(BaseModel):
    id: str
    name: str
    address: str
    contact: str
    specialties: List[str]


class ClinicsResponse(BaseModel):
    clinics: List[Clinic]


class AppointmentCreate(BaseModel):
    clinic_id: str
    reason: str
    date: str
    time: str


class Appointment(BaseModel):
    id: str
    clinic_id: str
    clinicName: str
    reason: str
    date: str
    time: str
    status: str
    created_at: datetime


class AppointmentList(BaseModel):
    appointments: List[Appointment]
