from fastapi import APIRouter, HTTPException
from models.schemas import (
    MedicationReminderCreate, 
    MedicationReminderList, 
    MedicationReminder,
    DrugInteractionRequest,
    DrugInteractionResponse
)
from datetime import datetime
import uuid

router = APIRouter()

@router.get("/medications/reminders", response_model=MedicationReminderList)
async def get_reminders():
    """Get user's medication reminders (Scaffold stub)"""
    return MedicationReminderList(reminders=[])

@router.post("/medications/reminders", response_model=MedicationReminder)
async def create_reminder(reminder: MedicationReminderCreate):
    """Create a new medication reminder (Scaffold stub)"""
    return MedicationReminder(
        id=str(uuid.uuid4()),
        isActive=True,
        created_at=datetime.utcnow(),
        **reminder.model_dump()
    )

@router.post("/medications/check-interactions", response_model=DrugInteractionResponse)
async def check_interactions(request: DrugInteractionRequest):
    """Check for drug-drug interactions (Scaffold stub)"""
    if len(request.drugs) < 2:
        raise HTTPException(status_code=400, detail="Provide at least two drugs to check interactions")
        
    return DrugInteractionResponse(
        interactions=[],
        warning_level="low",
        summary=f"Scaffold simulation: Checked interactions for {', '.join(request.drugs)}. No major interactions found in local stub database."
    )
