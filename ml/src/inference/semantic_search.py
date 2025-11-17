import os
import json
from functools import lru_cache
from typing import List, Dict

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

EMB_PATH = "data/processed/product_embeddings.npy"
ID_PATH = "data/processed/product_ids.json"
CATALOG_JSON_PATH = "data/processed/product_catalog.json"  # created earlier


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    model_name = "sentence-transformers/all-MiniLM-L6-v2"
    return SentenceTransformer(model_name)


@lru_cache(maxsize=1)
def get_embeddings_and_ids():
    if not os.path.exists(EMB_PATH) or not os.path.exists(ID_PATH):
        raise FileNotFoundError(
            "Embeddings or product_ids.json not found. "
            "Run build_product_embeddings.py first."
        )

    embeddings = np.load(EMB_PATH)
    with open(ID_PATH, "r", encoding="utf-8") as f:
        product_ids = json.load(f)

    return embeddings, product_ids


@lru_cache(maxsize=1)
def get_catalog_df() -> pd.DataFrame:
    if not os.path.exists(CATALOG_JSON_PATH):
        raise FileNotFoundError(
            f"Catalog JSON not found at {CATALOG_JSON_PATH}. "
            "Make sure you generated product_catalog.json."
        )
    df = pd.read_json(CATALOG_JSON_PATH, orient="records")
    return df


def semantic_search(query: str, top_k: int = 10) -> List[Dict]:
    if not query.strip():
        return []

    model = get_model()
    embeddings, product_ids = get_embeddings_and_ids()
    catalog_df = get_catalog_df()

    query_emb = model.encode([query], convert_to_numpy=True)[0]

    # Cosine similarity between query and all products
    emb_norms = np.linalg.norm(embeddings, axis=1, keepdims=True) + 1e-10
    normalized_emb = embeddings / emb_norms

    query_norm = np.linalg.norm(query_emb) + 1e-10
    query_emb_norm = query_emb / query_norm

    sims = normalized_emb @ query_emb_norm  # (N,)

    top_k = min(top_k, len(product_ids))
    idxs = np.argsort(-sims)[:top_k]

    results = []
    for idx in idxs:
        pid = product_ids[int(idx)]
        row = catalog_df.loc[catalog_df["product_id"] == pid].iloc[0]

        results.append(
            {
                "product_id": pid,
                "name": row["name"],
                "brand": row.get("brand", ""),
                "manufacturer": row.get("manufacturer", ""),
                "categories": row.get("categories", ""),
                "avg_rating": float(row.get("avg_rating", 0.0)),
                "num_reviews": int(row.get("num_reviews", 0)),
                "sentiment_score": float(row.get("sentiment_score", 0.0)),
                "image_url": row.get("image_url", ""),
                "similarity": float(sims[int(idx)]),
            }
        )

    return results
