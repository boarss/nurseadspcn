from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from models.schemas import ChatRequest, ChatResponse
import uuid

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Handle incoming chat messages.
    In scaffold mode, this returns a simulated response.
    Later, this will connect to the LLM Gateway and orchestrator.
    """
    conversation_id = request.conversation_id or str(uuid.uuid4())
    
    # Simulate LLM processing
    reply = (
        f"Thank you for your message: '{request.message}'. "
        f"I am currently in scaffold mode. Once the LLM gateway is connected, "
        f"I will provide evidence-based healthcare guidance.\n\n"
        f"⚠️ *Not medical advice.*"
    )
    
    return ChatResponse(
        reply=reply,
        conversation_id=conversation_id
    )
