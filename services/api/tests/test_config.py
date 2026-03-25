def test_settings_load(mock_keys):
    # This imports later to ensure mock_keys is applied
    from core.config import get_settings
    get_settings.cache_clear()
    settings = get_settings()
    
    assert settings.openai_api_key == "test-openai-key"
    assert settings.anthropic_api_key == "test-anthropic-key"
    assert settings.supabase_url == "https://test.supabase.co"
    assert settings.default_llm_provider in ["openai", "anthropic"]
