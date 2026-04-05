from fastapi import APIRouter, Depends, HTTPException
from models.schemas import (
    AppointmentList,
    Appointment,
    AppointmentCreate,
    ClinicsResponse,
    Clinic,
)
from routers.auth import get_current_user_id
from core.supabase_client import get_supabase_client
import uuid

router = APIRouter()
supabase = get_supabase_client()


@router.get("/appointments", response_model=AppointmentList)
async def get_appointments(user_id: str = Depends(get_current_user_id)):
    """Get the current user's appointments from Supabase."""
    result = (
        supabase.table("appointments")
        .select("*, clinics(name)")
        .eq("user_id", user_id)
        .order("date", desc=False)
        .execute()
    )

    appointments = [
        Appointment(
            id=a["id"],
            clinic_id=a["clinic_id"],
            clinicName=a["clinics"]["name"] if a.get("clinics") else "Unknown Clinic",
            reason=a["reason"],
            date=a["date"],
            time=a["time"],
            status=a["status"],
            created_at=a["created_at"],
        )
        for a in result.data
    ]
    return AppointmentList(appointments=appointments)


@router.post("/appointments")
async def create_appointment(
    appointment: AppointmentCreate,
    user_id: str = Depends(get_current_user_id),
):
    """Book a new appointment."""
    new_id = str(uuid.uuid4())
    row = {
        "id": new_id,
        "user_id": user_id,
        "clinic_id": appointment.clinic_id,
        "reason": appointment.reason,
        "date": appointment.date,
        "time": appointment.time,
        "status": "requested",
    }
    result = supabase.table("appointments").insert(row).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to book appointment")

    return {"status": "booked", "id": new_id}


@router.delete("/appointments/{appointment_id}")
async def cancel_appointment(
    appointment_id: str, user_id: str = Depends(get_current_user_id)
):
    """Cancel an appointment."""
    supabase.table("appointments").delete().eq("id", appointment_id).eq(
        "user_id", user_id
    ).execute()
    return {"status": "cancelled"}


@router.get("/appointments/clinics", response_model=ClinicsResponse)
async def get_clinics():
    """Get available clinics from the NurseAda database."""
    result = supabase.table("clinics").select("*").execute()

    clinics = [
        Clinic(
            id=c["id"],
            name=c["name"],
            address=c["address"],
            contact=c["contact"],
            specialties=c.get("specialties", []),
        )
        for c in result.data
    ]
    return ClinicsResponse(clinics=clinics)
