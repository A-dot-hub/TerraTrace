from fastapi import APIRouter
from typing import List, Dict, Any
from backend.app.scrapers.environmental_scraper import scrape_environmental_data, CACHED_ENVIRONMENTAL_DATA
from backend.app.scrapers.sustainability_news_scraper import scrape_sustainability_news, CACHED_SUSTAINABILITY_NEWS
from backend.app.database import get_database

router = APIRouter(prefix="/environment", tags=["Environmental Intelligence"])

@router.get("/news")
def get_environmental_news():
    db = get_database()

    # Try live scraper first
    try:
        env_items = scrape_environmental_data()
        news_items = scrape_sustainability_news()
        combined = env_items + news_items

        if db is not None:
            # Store/update in MongoDB environmental_data collection
            for item in combined:
                db.environmental_data.update_one(
                    {"title": item["title"]},
                    {"$set": item},
                    upsert=True
                )
        return combined
    except Exception:
        # Fallback to MongoDB cached items
        if db is not None:
            try:
                cached = list(db.environmental_data.find({}, {"_id": 0}))
                if cached:
                    return cached
            except Exception:
                pass

        # Static fallback
        return CACHED_ENVIRONMENTAL_DATA + CACHED_SUSTAINABILITY_NEWS
