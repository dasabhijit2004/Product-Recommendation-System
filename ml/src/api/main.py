import sys, os
# Add project root to Python path (Windows fix)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

# Now imports will work
from src.inference.sentiment_scorer import predict_sentiment_score
import random

app = FastAPI(title="Product Recommendation ML API")


class ExistingUserRequest(BaseModel):
    user_id: str
    recent_product_ids: List[str] = []
    recent_search_terms: List[str] = []


class ContextualRequest(BaseModel):
    product_id: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/recommend/new-user")
def recommend_new_user(limit: int = 10):
    """Get top N products by sentiment score (dummy products for now)."""
    sample_reviews = [
        "This is the best product I ever used!",
        "Really good quality.",
        "Amazing and very useful.",
        "It works perfectly.",
        "Average product but okay.",
        "Not good, disappointed.",
    ]

    products = []
    for i in range(limit):
        review = random.choice(sample_reviews)
        score = predict_sentiment_score(review)
        products.append({
            "id": f"p{i}",
            "name": f"Product {i}",
            "sentiment_score": round(score, 3)
        })

    products = sorted(products, key=lambda x: x["sentiment_score"], reverse=True)
    return {"products": products}


@app.post("/recommend/existing-user")
def recommend_existing_user(payload: ExistingUserRequest):
    return {
        "user_id": payload.user_id,
        "products": [
            {"id": "lap-123", "name": "Suggested Laptop"},
            {"id": "mouse-45", "name": "Wireless Mouse"},
            {"id": "kb-21", "name": "Mechanical Keyboard"},
        ],
    }


@app.post("/recommend/contextual")
def recommend_contextual(payload: ContextualRequest):
    return {
        "product_id": payload.product_id,
        "similar": [
            {"id": "lap-111", "name": "Similar Laptop A"},
            {"id": "lap-222", "name": "Similar Laptop B"},
        ],
        "accessories": [
            {"id": "bag-10", "name": "Laptop Bag"},
            {"id": "cool-10", "name": "Cooling Pad"},
        ],
    }
