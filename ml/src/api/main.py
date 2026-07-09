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

from src.recommendation.tfidf_similarity import TFIDFSimilarityEngine

from src.recommendation.related_tfidf import RelatedTFIDFEngine

from src.recommendation.frequently_bought import (
    get_frequently_bought_together
)


PRODUCTS_PATH = "data/processed/products_with_scores.csv"

CATALOG_PATH = "data/processed/product_catalog.json"

similarity_engine = TFIDFSimilarityEngine()

app = FastAPI(title="Product Recommendation ML API")

related_engine = RelatedTFIDFEngine()

class ExistingUserRequest(BaseModel):
    user_id: str
    recent_product_ids: list[str]
    recent_search_terms: list[str] = []

class ContextualRequest(BaseModel):
    product_id: str
    
def get_product_name(product_id: str):
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    for p in catalog:
        if p["product_id"] == product_id:
            return p.get("name")

    return None


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

    purchased = set(payload.recent_product_ids)

    scores = {}

    for pid in payload.recent_product_ids:

        similar = similarity_engine.get_similar_products(pid, top_n=10)

        for item in similar:

            product_id = item["product_id"]   # ✅ changed

            if product_id in purchased:
                continue

            if product_id not in scores:
                scores[product_id] = {
                    "product_id": product_id,
                    "name": item["name"],
                    "brand": item["brand"],
                    "categories": item["categories"],
                    "avg_rating": item["avg_rating"],
                    "num_reviews": item["num_reviews"],
                    "sentiment_score": item["sentiment_score"],
                    "price": item["price"],
                    "image_url": item.get("image_url", "/placeholder.png"),
                    "final_score": 0,
                }

            scores[product_id]["final_score"] += item["final_score"]

    recommendations = sorted(
        scores.values(),
        key=lambda x: x["final_score"],
        reverse=True,
    )

    return {
        "user_id": payload.user_id,
        "recommendations": recommendations[:12],
    }

@app.post("/recommend/contextual")
def recommend_contextual(payload: ContextualRequest):
    product_id = payload.product_id

    similar_products = similarity_engine.get_similar_products(product_id)

    product_name = get_product_name(product_id)

    return {
        "product_id": product_id,
        "product_name": product_name,
        "similar": similar_products,
        "accessories": []
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

@app.post("/recommend/related")
def recommend_related(payload: ContextualRequest):

    return {
        "product_id": payload.product_id,
        "related": related_engine.get_related_products(
            payload.product_id
        )
    }
    
    
@app.post("/recommend/fbt")
def recommend_fbt(payload: ContextualRequest):

    return {
        "product_id": payload.product_id,
        "products": get_frequently_bought_together(
            payload.product_id
        ),
    }