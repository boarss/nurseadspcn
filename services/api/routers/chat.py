import json
import uuid
import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import ChatRequest
from routers.auth import get_current_user_id
from core.supabase_client import get_supabase_client
from services.llm_gateway import llm_gateway

router = APIRouter()
supabase = get_supabase_client()
logger = logging.getLogger(__name__)

async def chat_stream_generator(request_msg: str, conversation_id: str, user_id: str):
    """
    Generator that handles:
    1. Saving the user message
    2. Loading history
    3. Emergency Guardrails
    4. Streaming LLM chunks
    5. Saving the assistant reply
    """
    # 1. Emergency Guardrail Check
    emergency_keywords = ["chest pain", "breathing", "unconscious", "bleeding profusely", "heart attack", "stroke"]
    if any(keyword in request_msg.lower() for keyword in emergency_keywords):
        emergency_reply = (
            "⚠️ **EMERGENCY WARNING** ⚠️\n\n"
            "Your symptoms indicate a potentially life-threatening medical emergency. "
            "Please stop using this chat and **call emergency services or go to the nearest hospital immediately**."
        )
        yield f"data: {json.dumps({'chunk': emergency_reply})}\n\n"
        
        # Save emergency interaction
        supabase.table("messages").insert([
            {"conversation_id": conversation_id, "role": "user", "content": request_msg},
            {"conversation_id": conversation_id, "role": "assistant", "content": emergency_reply}
        ]).execute()
        return

    # 2. Check/Create Conversation & Load History
    conversation = supabase.table("conversations").select("*").eq("id", conversation_id).execute()
    
    if not conversation.data:
        # Create new conversation
        title = request_msg[:30] + "..." if len(request_msg) > 30 else request_msg
        supabase.table("conversations").insert({
            "id": conversation_id,
            "user_id": user_id,
            "title": title
        }).execute()
        history = []
    else:
        # Load existing messages
        msgs = supabase.table("messages").select("*").eq("conversation_id", conversation_id).order("created_at").execute()
        history = [{"role": m["role"], "content": m["content"]} for m in msgs.data if m["role"] in ["user", "assistant"]]

    # 3. Save incoming user message
    supabase.table("messages").insert({
        "conversation_id": conversation_id,
        "role": "user",
        "content": request_msg
    }).execute()

    # Append new message to context for LLM
    history.append({"role": "user", "content": request_msg})

    # 4. Stream LLM chunks
    full_reply = ""
    try:
        async for chunk in llm_gateway.generate_stream(history):
            full_reply += chunk
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            
    except Exception as e:
        logger.error(f"Streaming error: {e}")
        error_msg = "\n[I'm sorry, I encountered an error while connecting to the primary neural network.]"
        full_reply += error_msg
        yield f"data: {json.dumps({'chunk': error_msg})}\n\n"

    # 5. Save assistant reply
    if full_reply:
         supabase.table("messages").insert({
            "conversation_id": conversation_id,
            "role": "assistant",
            "content": full_reply
        }).execute()


@router.post("/chat")
async def chat_endpoint(request: ChatRequest, user_id: str = Depends(get_current_user_id)):
    """
    Handle incoming chat messages via Server-Sent Events (SSE).
    """
    conversation_id = request.conversation_id or str(uuid.uuid4())
    
    return StreamingResponse(
        chat_stream_generator(request.message, conversation_id, user_id),
        media_type="text/event-stream"
    )
