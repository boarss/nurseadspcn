from fastapi import APIRouter
from models.schemas import AppointmentList, ClinicsResponse

router = APIRouter()

@router.get("/appointments", response_model=AppointmentList)
async def get_appointments():
    """Get user's appointments (Scaffold stub)"""
    return AppointmentList(appointments=[])

@router.get("/appointments/clinics", response_model=ClinicsResponse)
async def get_clinics():
    """Get available clinics (Scaffold stub)"""
    return ClinicsResponse(clinics=[])
