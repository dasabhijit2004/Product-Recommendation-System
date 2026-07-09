from collections import Counter
import json
import os

ORDERS_PATH = "data/processed/orders.json"
CATALOG_PATH = "data/processed/product_catalog.json"


def get_frequently_bought_together(product_id):

    if not os.path.exists(ORDERS_PATH):
        return []

    with open(ORDERS_PATH, "r", encoding="utf-8") as f:
        orders = json.load(f)

    counter = Counter()

    for order in orders:

        products = order.get("products", [])

        if product_id in products:

            for p in products:

                if p != product_id:
                    counter[p] += 1

    if not counter:
        return []

    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    results = []

    for pid, count in counter.most_common(8):

        product = next(
            (
                p
                for p in catalog
                if p["product_id"] == pid
            ),
            None,
        )

        if product:
            results.append(
                {
                    "id": product["product_id"],
                    "name": product["name"],
                    "count": count,
                }
            )

    return results