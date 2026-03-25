import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add the parent directory to sys.path so we can import our modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app

@pytest.fixture
def client():
    """Provides a TestClient for testing the FastAPI application."""
    return TestClient(app)

@pytest.fixture
def mock_keys(monkeypatch):
    """Mock environment variables for API keys to ensure tests don't require real keys."""
    monkeypatch.setenv("OPENAI_API_KEY", "test-openai-key")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-anthropic-key")
    monkeypatch.setenv("SUPABASE_URL", "https://test.supabase.co")
    monkeypatch.setenv("SUPABASE_KEY", "test-supabase-key")
