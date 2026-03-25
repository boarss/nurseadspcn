from supabase import create_client, Client
from core.config import get_settings


def get_supabase_client() -> Client:
    """Create a Supabase client using service role key for backend operations."""
    settings = get_settings()
    return create_client(
        settings.supabase_url,
        settings.supabase_service_role_key,
    )
