from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from models.schemas import ChatRequest, ChatResponse
import uuid
from services.llm_gateway import llm_gateway

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Handle incoming chat messages.
    In scaffold mode, this returns a simulated response.
    Later, this will connect to the LLM Gateway and orchestrator.
    """
    conversation_id = request.conversation_id or str(uuid.uuid4())
    
    messages = [{"role": "user", "content": request.message}]
    
    # Process through the unified AI gateway
    reply = await llm_gateway.generate_response(messages)
    
    return ChatResponse(
        reply=reply,
        conversation_id=conversation_id
    )
