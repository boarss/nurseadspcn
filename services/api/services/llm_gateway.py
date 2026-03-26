import os
from typing import List, Dict, Any, Optional, AsyncGenerator
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
from core.config import get_settings

SYSTEM_PROMPT = """
You are NurseAda, a professional, empathetic, and culturally aware AI virtual healthcare assistant for primary care users, primarily in Nigeria and Africa.
Your goal is to provide accurate health information, analyze symptoms, offer evidence-based traditional/herbal remedies, and assist with medication and appointments.

Guidelines:
1. Empathy & Professionalism: Always be compassionate. Use a warm tone but remain clinical.
2. Safety First: If symptoms indicate an EMERGENCY (e.g., severe chest pain, trouble breathing, heavy bleeding, unconsciousness), STOP analysis immediately and firmly advise the user to seek immediate emergency medical care.
3. Disclaimer: You must clarify that you are an AI, and your advice does NOT replace professional medical consultation.
4. Cultural Context: Be aware of Nigerian/African context and local terminology for ailments and remedies when applicable.
"""

class LLMGateway:
    """
    Unified interface for language models (OpenAI and Anthropic).
    Provides a consistent API for the chat orchestrator.
    """
    def __init__(self):
        self.settings = get_settings()
        self.default_provider = self.settings.default_llm_provider
        
        # Initialize clients if keys are available
        self.openai_client = None
        if self.settings.openai_api_key:
            self.openai_client = AsyncOpenAI(api_key=self.settings.openai_api_key)
            
        self.anthropic_client = None
        if self.settings.anthropic_api_key:
            self.anthropic_client = AsyncAnthropic(api_key=self.settings.anthropic_api_key)

    def _prepare_messages(self, messages: List[Dict[str, str]], provider: str) -> List[Dict[str, str]]:
        """Format messages properly for the specific provider."""
        if provider == "openai":
            # Ensure system prompt is first
            if not any(m.get("role") == "system" for m in messages):
                return [{"role": "system", "content": SYSTEM_PROMPT}] + messages
            return messages
        elif provider == "anthropic":
            # Anthropic handles system prompts separately in newer APIs, 
            # so we strip it from the messages array to pass it as a kwarg later,
            # but for simplicity, we can also keep it as user context if we use older methods.
            # Here we just return non-system messages since we will pass system prompt explicitly.
            return [m for m in messages if m.get("role") != "system"]
        
        return messages

    async def generate_response(
        self, 
        messages: List[Dict[str, str]], 
        provider: Optional[str] = None,
        model: Optional[str] = None
    ) -> str:
        """
        Generate a complete response using the specified provider.
        """
        active_provider = provider or self.default_provider
        
        if not self.openai_client and not self.anthropic_client:
            return "NurseAda LLM Gateway is in scaffold mode. Please configure API keys."

        try:
            if active_provider == "openai" and self.openai_client:
                active_model = model or "gpt-4o"
                formatted_msgs = self._prepare_messages(messages, "openai")
                response = await self.openai_client.chat.completions.create(
                    model=active_model,
                    messages=formatted_msgs,
                    temperature=0.7,
                )
                return response.choices[0].message.content or ""
                
            elif active_provider == "anthropic" and self.anthropic_client:
                active_model = model or "claude-3-5-sonnet-20241022"
                formatted_msgs = self._prepare_messages(messages, "anthropic")
                system_msg_content = next((m["content"] for m in messages if m.get("role") == "system"), SYSTEM_PROMPT)
                
                response = await self.anthropic_client.messages.create(
                    model=active_model,
                    system=system_msg_content,
                    max_tokens=1024,
                    messages=formatted_msgs,
                    temperature=0.7,
                )
                return response.content[0].text
                
            else:
                return f"Error: Provider '{active_provider}' is not configured properly."
                
        except Exception as e:
            return f"Error connecting to LLM provider: {str(e)}"

    async def generate_stream(
        self, 
        messages: List[Dict[str, str]], 
        provider: Optional[str] = None,
        model: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Stream the LLM response chunk by chunk.
        """
        active_provider = provider or self.default_provider
        
        if not self.openai_client and not self.anthropic_client:
            yield "NurseAda LLM Gateway is in scaffold mode. Please configure API keys."
            return

        try:
            if active_provider == "openai" and self.openai_client:
                active_model = model or "gpt-4o"
                formatted_msgs = self._prepare_messages(messages, "openai")
                
                stream = await self.openai_client.chat.completions.create(
                    model=active_model,
                    messages=formatted_msgs,
                    temperature=0.7,
                    stream=True,
                )
                async for chunk in stream:
                    if chunk.choices and chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content

            elif active_provider == "anthropic" and self.anthropic_client:
                active_model = model or "claude-3-5-sonnet-20241022"
                formatted_msgs = self._prepare_messages(messages, "anthropic")
                system_msg_content = next((m["content"] for m in messages if m.get("role") == "system"), SYSTEM_PROMPT)
                
                async with self.anthropic_client.messages.stream(
                    model=active_model,
                    system=system_msg_content,
                    max_tokens=1024,
                    messages=formatted_msgs,
                    temperature=0.7,
                ) as stream:
                    async for text in stream.text_stream:
                        yield text
            else:
                yield f"Error: Provider '{active_provider}' is not configured properly."
                
        except Exception as e:
            yield f"\n\n[Error streaming from LLM: {str(e)}]"

# Singleton instance
llm_gateway = LLMGateway()
