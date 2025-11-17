import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from src.inference.sentiment_scorer import predict_sentiment_score
import random

import pandas as pd

import json

from src.inference.semantic_search import semantic_search

PRODUCTS_PATH = "data/processed/products_with_scores.csv"

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
    """Return top products using sentiment + rating score."""
    df = pd.read_csv(PRODUCTS_PATH)

    # Sort by sentiment_score + avg_rating
    df["final_score"] = df["sentiment_score"] * 0.7 + df["avg_rating"] * 0.3

    df = df.sort_values("final_score", ascending=False).head(limit)

    return {
        "products": df.to_dict(orient="records")
    }


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

@app.get("/products/{product_id}")
def get_product(product_id: str):
    with open("data/processed/product_catalog.json", "r", encoding="utf-8") as f:
        catalog = json.load(f)

    for p in catalog:
        if p["product_id"] == product_id:
            return p

    return {"error": "Product not found"}, 404

@app.get("/products/all")
def get_all_products():
    with open("data/processed/product_catalog.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return {"products": data}

@app.get("/search")
def search_products(q: str, limit: int = 20):
    """
    Semantic search over products using embeddings.
    """
    results = semantic_search(q, top_k=limit)
    return {"products": results}

