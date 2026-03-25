import os
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
from core.config import get_settings

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

    async def generate_response(
        self, 
        messages: List[Dict[str, str]], 
        provider: Optional[str] = None,
        model: Optional[str] = None
    ) -> str:
        """
        Generate a response using the specified provider.
        Assumes messages follow the format [{"role": "user", "content": "..."}]
        """
        active_provider = provider or self.default_provider
        
        # Scaffold mode check
        if not self.openai_client and not self.anthropic_client:
            return (
                "NurseAda LLM Gateway is in scaffold mode. "
                "Please configure API keys in the `.env` file to enable real AI responses."
            )

        try:
            if active_provider == "openai" and self.openai_client:
                active_model = model or "gpt-4o"
                response = await self.openai_client.chat.completions.create(
                    model=active_model,
                    messages=messages,
                    temperature=0.7,
                )
                return response.choices[0].message.content or ""
                
            elif active_provider == "anthropic" and self.anthropic_client:
                active_model = model or "claude-3-5-sonnet-20241022"
                # Anthropic requires system prompt separately, but for scaffold we simplify
                response = await self.anthropic_client.messages.create(
                    model=active_model,
                    max_tokens=1024,
                    messages=messages,
                    temperature=0.7,
                )
                return response.content[0].text
                
            else:
                return f"Error: Provider '{active_provider}' is not configured properly."
                
        except Exception as e:
            return f"Error connecting to LLM provider: {str(e)}"

# Singleton instance
llm_gateway = LLMGateway()
