from supabase import create_client, Client
from app.config import get_settings


def get_supabase_client() -> Client:
    """Get a Supabase client using the anon/public key (for auth operations)."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_key)


def get_supabase_admin_client() -> Client:
    """Get a Supabase client using the service role key (for admin operations)."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_key)
