import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import pandas as pd
import os
from collections import defaultdict
from src.inference.sentiment_scorer import predict_sentiment_score

import random

CATEGORY_BASE_PRICES = {
    "electronics": (500, 800),
    "laptops": (45000, 95000),
    "mobiles": (9000, 75000),
    "computers": (1000, 5000),
    "home": (200, 2000),
    "kitchen": (150, 2500),
    "books": (100, 600),
    "beauty": (80, 1500),
    "fashion": (200, 3000),
    "default": (200, 3000),
}

RAW_DATA_DIR = "data/raw/kaggle_sentiment"
PROCESSED_DIR = "data/processed"


def load_dataset():
    path = os.path.join(RAW_DATA_DIR, "sample30.csv")
    print("Loading:", path)
    return pd.read_csv(path, encoding="latin-1")


def generate_price(categories: str):
    cats = categories.lower()

    for key, (mn, mx) in CATEGORY_BASE_PRICES.items():
        if key in cats:
            return round(random.uniform(mn, mx), 2)

    # fallback
    mn, mx = CATEGORY_BASE_PRICES["default"]
    return round(random.uniform(mn, mx), 2)

def build_catalog():
    df = load_dataset()

    # Group by product
    grouped = df.groupby("id")

    products = []

    for pid, group in grouped:
        product_name = group["name"].iloc[0]
        brand = group["brand"].iloc[0]
        manufacturer = group["manufacturer"].iloc[0]
        categories = group["categories"].iloc[0]

        ratings = group["reviews_rating"].dropna().tolist()
        reviews = group["reviews_text"].dropna().tolist()

        # Average product rating
        avg_rating = sum(ratings) / len(ratings) if len(ratings) > 0 else 0

        # Predict sentiment score for each review
        sentiment_scores = []
        for r in reviews[:20]:  # limit for speed
            score = predict_sentiment_score(str(r))
            sentiment_scores.append(score)

        avg_sentiment_score = (
            sum(sentiment_scores) / len(sentiment_scores)
            if len(sentiment_scores) > 0
            else 0
        )

        products.append({
            "product_id": pid,
            "name": product_name,
            "brand": brand,
            "manufacturer": manufacturer,
            "categories": categories,
            "avg_rating": round(avg_rating, 3),
            "num_reviews": len(ratings),
            "sentiment_score": round(avg_sentiment_score, 3),
            "price": generate_price(categories),
        })

    catalog_df = pd.DataFrame(products)

    os.makedirs(PROCESSED_DIR, exist_ok=True)
    out_path = os.path.join(PROCESSED_DIR, "products_with_scores.csv")
    catalog_df.to_csv(out_path, index=False)
    print("Saved:", out_path)


if __name__ == "__main__":
    build_catalog()
