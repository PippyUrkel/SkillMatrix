from supabase import Client
from gotrue.errors import AuthApiError


class AuthService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    def sign_up(self, email: str, password: str) -> dict:
        """Register a new user with Supabase Auth."""
        try:
            response = self.supabase.auth.sign_up(
                {"email": email, "password": password}
            )
            return {
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                },
                "session": {
                    "access_token": response.session.access_token,
                    "refresh_token": response.session.refresh_token,
                    "expires_in": response.session.expires_in,
                }
                if response.session
                else None,
            }
        except AuthApiError as e:
            raise ValueError(str(e))

    def sign_in(self, email: str, password: str) -> dict:
        """Sign in an existing user."""
        try:
            response = self.supabase.auth.sign_in_with_password(
                {"email": email, "password": password}
            )
            return {
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                },
                "session": {
                    "access_token": response.session.access_token,
                    "refresh_token": response.session.refresh_token,
                    "expires_in": response.session.expires_in,
                },
            }
        except AuthApiError as e:
            raise ValueError(str(e))

    def get_user(self, access_token: str) -> dict:
        """Get the current user from an access token."""
        try:
            response = self.supabase.auth.get_user(access_token)
            return {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": str(response.user.created_at),
            }
        except AuthApiError as e:
            raise ValueError(str(e))
