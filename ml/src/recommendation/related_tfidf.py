import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

CATALOG_PATH = "data/processed/product_catalog.json"

class RelatedTFIDFEngine:

    def __init__(self):
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            self.products = json.load(f)

        corpus = []

        for p in self.products:
            text = (
                f"{p.get('name','')} "
                f"{p.get('brand','')} "
                f"{p.get('categories','')}"
            )

            corpus.append(text)

        self.vectorizer = TfidfVectorizer(
            stop_words="english"
        )

        self.matrix = self.vectorizer.fit_transform(corpus)

    def get_related_products(self, product_id, top_n=8):

        current_idx = None

        for i, p in enumerate(self.products):
            if p["product_id"] == product_id:
                current_idx = i
                break

        if current_idx is None:
            return []

        sims = cosine_similarity(
            self.matrix[current_idx],
            self.matrix
        )[0]

        current_category = str(
            self.products[current_idx].get("categories", "")
        ).lower()

        results = []

        for i, score in enumerate(sims):

            if i == current_idx:
                continue

            product = self.products[i]

            category = str(
                product.get("categories", "")
            ).lower()

            # Skip almost identical category
            if category == current_category:
                continue

            results.append({
                "id": product["product_id"],
                "name": product["name"],
                "score": float(score)
            })

        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return results[:top_n]