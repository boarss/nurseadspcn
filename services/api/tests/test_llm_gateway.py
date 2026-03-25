import pytest
from services.llm_gateway import LLMGateway

@pytest.mark.asyncio
async def test_llm_gateway_scaffold_mode(monkeypatch):
    # Ensure keys are clear for scaffold mode test
    monkeypatch.setenv("OPENAI_API_KEY", "")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "")
    
    # Reload settings/gateway
    gateway = LLMGateway()
    gateway.openai_client = None
    gateway.anthropic_client = None
    
    messages = [{"role": "user", "content": "Hi"}]
    response = await gateway.generate_response(messages)
    
    assert "NurseAda LLM Gateway is in scaffold mode" in response
