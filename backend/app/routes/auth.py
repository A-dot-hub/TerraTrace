import uuid
import datetime
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status
from backend.app.models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from backend.app.database import get_database, in_memory_store
from backend.app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate):
    """
    Registers a new user account into MongoDB Atlas 'users' collection.
    """
    db = get_database()
    email_clean = user_data.email.strip().lower()
    user_id = str(uuid.uuid4())
    now_str = datetime.datetime.utcnow().isoformat()

    # Check for existing user in MongoDB Atlas
    if db is not None:
        try:
            existing = db.users.find_one({"email": email_clean})
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="An account with this email already exists. Please log in.",
                )
        except HTTPException:
            raise
        except Exception as e:
            logger.warning("MongoDB lookup error on register: %s", str(e))

    # Check in-memory store
    for u in in_memory_store.get("users", []):
        if u.get("email") == email_clean:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists. Please log in.",
            )

    hashed_pw = hash_password(user_data.password)

    user_record = {
        "id": user_id,
        "name": user_data.name.strip(),
        "email": email_clean,
        "password": hashed_pw,
        "created_at": now_str,
    }

    # Persist in MongoDB Atlas
    if db is not None:
        try:
            db.users.insert_one(dict(user_record))
            logger.info("New user '%s' (%s) saved to MongoDB Atlas users collection.", user_record["name"], email_clean)
        except Exception as e:
            logger.error("Failed to insert user into MongoDB Atlas: %s", str(e))
            in_memory_store["users"].append(user_record)
    else:
        in_memory_store["users"].append(user_record)

    token = create_access_token(user_record)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            name=user_record["name"],
            email=user_record["email"],
            created_at=now_str,
        ),
    )

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    """
    Authenticates a user against MongoDB Atlas 'users' collection.
    """
    db = get_database()
    email_clean = credentials.email.strip().lower()
    user_record = None

    # Search in MongoDB Atlas
    if db is not None:
        try:
            user_record = db.users.find_one({"email": email_clean})
        except Exception as e:
            logger.warning("MongoDB find error on login: %s", str(e))

    # Search in in-memory store fallback
    if not user_record:
        for u in in_memory_store.get("users", []):
            if u.get("email") == email_clean:
                user_record = u
                break

    # Seed and allow demo account if requested
    if not user_record and email_clean == "alex.morgan@terratrace.earth":
        now_str = datetime.datetime.utcnow().isoformat()
        user_record = {
            "id": "demo-user-id",
            "name": "Alex Morgan",
            "email": "alex.morgan@terratrace.earth",
            "password": hash_password("password123"),
            "created_at": now_str,
        }
        if db is not None:
            try:
                db.users.insert_one(dict(user_record))
            except Exception:
                pass

    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Verify password
    stored_password = user_record.get("password", "")
    if not verify_password(credentials.password, stored_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(user_record)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_record.get("id", "user-id"),
            name=user_record.get("name", "User"),
            email=user_record.get("email", email_clean),
            created_at=user_record.get("created_at"),
        ),
    )

@router.get("/me", response_model=UserResponse)
def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Returns the currently authenticated user based on the Bearer JWT token.
    """
    db = get_database()

    if authorization:
        token_data = decode_access_token(authorization)
        if token_data and token_data.get("email"):
            email = token_data["email"].lower()
            user_id = token_data.get("sub", "")
            
            # Query MongoDB Atlas
            if db is not None:
                try:
                    user_doc = db.users.find_one({"email": email}, {"_id": 0, "password": 0})
                    if user_doc:
                        return UserResponse(
                            id=user_doc.get("id", user_id),
                            name=user_doc.get("name", token_data.get("name", "User")),
                            email=user_doc.get("email", email),
                            created_at=user_doc.get("created_at"),
                        )
                except Exception as e:
                    logger.warning("MongoDB find error in /auth/me: %s", str(e))

            # Query in-memory store
            for u in in_memory_store.get("users", []):
                if u.get("email") == email:
                    return UserResponse(
                        id=u.get("id", user_id),
                        name=u.get("name", token_data.get("name", "User")),
                        email=u.get("email", email),
                        created_at=u.get("created_at"),
                    )

            # Token is valid even if DB read failed
            return UserResponse(
                id=user_id or "user-id",
                name=token_data.get("name", "User"),
                email=email,
                created_at=datetime.datetime.utcnow().isoformat(),
            )

    # Fallback to demo user if no authorization header provided
    return UserResponse(
        id="demo-user-id",
        name="Alex Morgan",
        email="alex.morgan@terratrace.earth",
        created_at=datetime.datetime.utcnow().isoformat(),
    )
