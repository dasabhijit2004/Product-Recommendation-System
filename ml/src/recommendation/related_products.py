import json

CATALOG_PATH = "data/processed/product_catalog.json"

def get_related_products(product_id):
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        products = json.load(f)

    current = next(
        (p for p in products if p["product_id"] == product_id),
        None
    )

    if not current:
        return []

    current_category = current["categories"]

    related = []

    for p in products:
        if p["product_id"] == product_id:
            continue

        current_category = str(current.get("categories", "")).lower()

        for p in products:
            if p["product_id"] == product_id:
                continue

            category = str(p.get("categories", "")).lower()

            if current_category in category or category in current_category:
                related.append({
                    "id": p["product_id"],
                    "name": p["name"],
                    "score": (
                        p.get("avg_rating", 0)
                        + p.get("sentiment_score", 0)
                    )
                })

    related.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return related[:8]