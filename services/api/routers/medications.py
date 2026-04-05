from fastapi import APIRouter, HTTPException, Depends
from models.schemas import (
    MedicationReminderCreate,
    MedicationReminderList,
    MedicationReminder,
    DrugInteractionRequest,
    DrugInteractionResponse,
)
from routers.auth import get_current_user_id
from core.supabase_client import get_supabase_client
from services.cdss import cdss_service
from datetime import datetime
import uuid

router = APIRouter()
supabase = get_supabase_client()


@router.get("/medications/reminders", response_model=MedicationReminderList)
async def get_reminders(user_id: str = Depends(get_current_user_id)):
    """Get the current user's medication reminders from Supabase."""
    result = (
        supabase.table("medication_reminders")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    reminders = [
        MedicationReminder(
            id=r["id"],
            drugName=r["drug_name"],
            dosage=r["dosage"],
            frequency=r["frequency"],
            time=r["time"],
            isActive=r["is_active"],
            created_at=r["created_at"],
        )
        for r in result.data
    ]
    return MedicationReminderList(reminders=reminders)


@router.post("/medications/reminders", response_model=MedicationReminder)
async def create_reminder(
    reminder: MedicationReminderCreate,
    user_id: str = Depends(get_current_user_id),
):
    """Create a new medication reminder in Supabase."""
    new_id = str(uuid.uuid4())
    row = {
        "id": new_id,
        "user_id": user_id,
        "drug_name": reminder.drugName,
        "dosage": reminder.dosage,
        "frequency": reminder.frequency,
        "time": reminder.time,
        "is_active": True,
    }
    result = supabase.table("medication_reminders").insert(row).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create reminder")

    r = result.data[0]
    return MedicationReminder(
        id=r["id"],
        drugName=r["drug_name"],
        dosage=r["dosage"],
        frequency=r["frequency"],
        time=r["time"],
        isActive=r["is_active"],
        created_at=r["created_at"],
    )


@router.delete("/medications/reminders/{reminder_id}")
async def delete_reminder(
    reminder_id: str, user_id: str = Depends(get_current_user_id)
):
    """Delete a medication reminder."""
    supabase.table("medication_reminders").delete().eq("id", reminder_id).eq(
        "user_id", user_id
    ).execute()
    return {"status": "deleted"}


@router.patch("/medications/reminders/{reminder_id}/toggle")
async def toggle_reminder(
    reminder_id: str, user_id: str = Depends(get_current_user_id)
):
    """Toggle the is_active state of a medication reminder."""
    current = (
        supabase.table("medication_reminders")
        .select("is_active")
        .eq("id", reminder_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not current.data:
        raise HTTPException(status_code=404, detail="Reminder not found")

    new_state = not current.data[0]["is_active"]
    supabase.table("medication_reminders").update({"is_active": new_state}).eq(
        "id", reminder_id
    ).eq("user_id", user_id).execute()
    return {"is_active": new_state}


@router.post(
    "/medications/check-interactions", response_model=DrugInteractionResponse
)
async def check_interactions(request: DrugInteractionRequest):
    """Check for drug-drug interactions using the CDSS service."""
    if len(request.drugs) < 2:
        raise HTTPException(
            status_code=400, detail="Provide at least two drugs to check interactions"
        )

    result = await cdss_service.check_drug_interactions(request.drugs)

    return DrugInteractionResponse(
        interactions=result.get("interactions", []),
        warning_level=result.get("warning_level", "unknown"),
        summary=result.get("summary", "Analysis complete."),
    )
