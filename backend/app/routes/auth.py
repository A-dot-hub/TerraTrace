import uuid
import datetime
from fastapi import APIRouter, HTTPException, status
from backend.app.models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from backend.app.database import get_database, in_memory_store

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserCreate):
    db = get_database()
    user_id = str(uuid.uuid4())
    now_str = datetime.datetime.utcnow().isoformat()

    new_user = {
        "id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "created_at": now_str,
    }

    if db is not None:
        try:
            existing = db.users.find_one({"email": user_data.email})
            if existing:
                raise HTTPException(status_code=400, detail="User already exists with this email")
            db.users.insert_one({**new_user, "password": user_data.password})
        except Exception:
            in_memory_store["users"].append(new_user)
    else:
        in_memory_store["users"].append(new_user)

    return TokenResponse(
        access_token=f"jwt-token-{user_id}",
        token_type="bearer",
        user=UserResponse(**new_user)
    )

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    db = get_database()
    user_record = None

    if db is not None:
        try:
            user_record = db.users.find_one({"email": credentials.email})
        except Exception:
            pass

    if not user_record:
        # Check in memory or allow standard demo login
        user_record = next(
            (u for u in in_memory_store["users"] if u.get("email") == credentials.email),
            {
                "id": "demo-user-id",
                "name": "Alex Morgan",
                "email": credentials.email,
                "created_at": datetime.datetime.utcnow().isoformat()
            }
        )

    return TokenResponse(
        access_token=f"jwt-token-{user_record.get('id', 'demo-user')}",
        token_type="bearer",
        user=UserResponse(
            id=user_record.get("id", "demo-user-id"),
            name=user_record.get("name", "Alex Morgan"),
            email=user_record.get("email", credentials.email),
            created_at=user_record.get("created_at")
        )
    )

@router.get("/me", response_model=UserResponse)
def get_current_user():
    return UserResponse(
        id="demo-user-id",
        name="Alex Morgan",
        email="alex.morgan@terratrace.earth",
        created_at=datetime.datetime.utcnow().isoformat()
    )
