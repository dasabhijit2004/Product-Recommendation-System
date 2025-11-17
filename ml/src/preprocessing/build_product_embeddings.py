import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import json
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

RAW_CATALOG_PATH = "data/processed/products_with_scores.csv"
EMB_PATH = "data/processed/product_embeddings.npy"
ID_PATH = "data/processed/product_ids.json"


def load_catalog() -> pd.DataFrame:
    if not os.path.exists(RAW_CATALOG_PATH):
        raise FileNotFoundError(f"Catalog not found at {RAW_CATALOG_PATH}. "
                                f"Run build_product_catalog.py first.")
    df = pd.read_csv(RAW_CATALOG_PATH)
    return df


def build_text(row: pd.Series) -> str:
    """
    Build a single text string for each product
    using name + brand + categories + manufacturer.
    """
    parts = [
        str(row.get("name", "")),
        str(row.get("brand", "")),
        str(row.get("categories", "")),
        str(row.get("manufacturer", "")),
    ]
    return " | ".join(p for p in parts if p and p != "nan")


def main():
    print("Loading catalog...")
    df = load_catalog()
    print(f"Catalog size: {len(df)} products")

    model_name = "sentence-transformers/all-MiniLM-L6-v2"
    print(f"Loading embedding model: {model_name}")
    model = SentenceTransformer(model_name)

    texts = []
    product_ids = []

    for _, row in df.iterrows():
        pid = str(row["product_id"])
        text = build_text(row)
        product_ids.append(pid)
        texts.append(text)

    print("Encoding products to embeddings...")
    embeddings = model.encode(texts, show_progress_bar=True, batch_size=64, convert_to_numpy=True)

    os.makedirs(os.path.dirname(EMB_PATH), exist_ok=True)

    np.save(EMB_PATH, embeddings)
    print(f"Saved embeddings to {EMB_PATH}")

    with open(ID_PATH, "w", encoding="utf-8") as f:
        json.dump(product_ids, f, ensure_ascii=False, indent=2)
    print(f"Saved product IDs to {ID_PATH}")


if __name__ == "__main__":
    main()
