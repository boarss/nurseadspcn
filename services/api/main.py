from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, herbal, medications, appointments
from core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="NurseAda API",
    description="Backend services for NurseAda virtual healthcare assistant",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, tags=["Chat"])
app.include_router(herbal.router, tags=["Herbal Remedies"])
app.include_router(medications.router, tags=["Medications"])
app.include_router(appointments.router, tags=["Appointments"])

@app.get("/")
async def root():
    return {"message": "NurseAda API is running", "status": "ok"}
