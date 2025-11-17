import pandas as pd
import json
import os

INPUT = "data/processed/products_with_scores.csv"
OUTPUT = "data/processed/product_catalog.json"

REQUIRED_COLUMNS = [
    "product_id",
    "name",
    "brand",
    "manufacturer",
    "categories",
    "avg_rating",
    "num_reviews",
    "sentiment_score"
]

def generate_catalog():
    if not os.path.exists(INPUT):
        raise FileNotFoundError(f"{INPUT} not found. Run build_product_catalog.py first.")

    df = pd.read_csv(INPUT)

    # Validate columns
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise Exception("Missing columns in CSV: " + ", ".join(missing))

    catalog = df[REQUIRED_COLUMNS].to_dict(orient="records")

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print(f"Saved: {OUTPUT}")


if __name__ == "__main__":
    generate_catalog()
