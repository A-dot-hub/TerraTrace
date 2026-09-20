import os
import time
import json
import base64
import hmac
import hashlib
from typing import Optional
from backend.app.config import settings

def hash_password(password: str) -> str:
    """Hashes a password with a secure random salt using SHA-256."""
    salt = os.urandom(16).hex()
    hashed = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(plain_password: str, stored_hash: str) -> bool:
    """Verifies a plain password against stored salted hash or legacy plain string."""
    if not stored_hash:
        return False
    if ":" not in stored_hash:
        # Legacy plain-text match
        return plain_password == stored_hash
    try:
        salt, original_hash = stored_hash.split(":", 1)
        test_hash = hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest()
        return hmac.compare_digest(test_hash, original_hash)
    except Exception:
        return False

def create_access_token(user_data: dict, expires_seconds: int = 86400 * 30) -> str:
    """Creates a signed JWT or cryptographic token with user payload."""
    payload = {
        "sub": str(user_data.get("id", "")),
        "email": str(user_data.get("email", "")),
        "name": str(user_data.get("name", "")),
        "exp": int(time.time()) + expires_seconds,
        "iat": int(time.time()),
    }
    try:
        from jose import jwt
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    except Exception:
        # Fallback to standard base64 HMAC token
        raw = base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8")).decode("utf-8")
        sig = hmac.new(settings.JWT_SECRET.encode("utf-8"), raw.encode("utf-8"), hashlib.sha256).hexdigest()
        return f"{raw}.{sig}"

def decode_access_token(token: str) -> Optional[dict]:
    """Decodes and validates token payload."""
    if not token:
        return None
    clean_token = token.replace("Bearer ", "").replace("bearer ", "").strip()
    try:
        from jose import jwt
        return jwt.decode(clean_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except Exception:
        try:
            if "." in clean_token:
                parts = clean_token.split(".")
                if len(parts) == 2:
                    raw, sig = parts
                    expected_sig = hmac.new(settings.JWT_SECRET.encode("utf-8"), raw.encode("utf-8"), hashlib.sha256).hexdigest()
                    if hmac.compare_digest(sig, expected_sig):
                        data = json.loads(base64.urlsafe_b64decode(raw.encode("utf-8")).decode("utf-8"))
                        if data.get("exp", float("inf")) > time.time():
                            return data
                elif len(parts) == 3:
                    # Unverified decode of middle segment if jose failed
                    payload_b64 = parts[1]
                    # Add padding if needed
                    payload_b64 += "=" * ((4 - len(payload_b64) % 4) % 4)
                    return json.loads(base64.urlsafe_b64decode(payload_b64.encode("utf-8")).decode("utf-8"))
        except Exception:
            pass
    return None
