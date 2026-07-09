import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

CATALOG_PATH = "data/processed/product_catalog.json"

class TFIDFSimilarityEngine:
    def __init__(self):
        self.products = []
        self.product_ids = []
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = None
        self.similarity_matrix = None

        self._load_and_prepare()

    def _load_and_prepare(self):
        if not os.path.exists(CATALOG_PATH):
            raise Exception("product_catalog.json not found")

        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            self.products = json.load(f)

        # Combine text features
        corpus = []
        for p in self.products:
            combined_text = f"{p['name']} {p['brand']} {p['categories']}"
            corpus.append(combined_text)
            self.product_ids.append(p["product_id"])

        # TF-IDF fit
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

        # Cosine similarity matrix
        self.similarity_matrix = cosine_similarity(self.tfidf_matrix)

    def get_similar_products(self, product_id, top_n=20):
        if product_id not in self.product_ids:
            return []

        idx = self.product_ids.index(product_id)

        similarity_scores = list(enumerate(self.similarity_matrix[idx]))

        # Remove itself
        similarity_scores = [s for s in similarity_scores if s[0] != idx]

        # Sort by similarity score
        similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

        top_matches = similarity_scores[:top_n]

        results = []
        for i, score in top_matches:
            product = self.products[i]
            results.append({
            "product_id": product["product_id"],
            "name": product["name"],
            "brand": product["brand"],
            "categories": product["categories"],
            "avg_rating": product["avg_rating"],
            "num_reviews": product["num_reviews"],
            "sentiment_score": product["sentiment_score"],
            "price": product["price"],
            "image_url": product.get("image_url", "/placeholder.png"),
            "final_score": round(float(score), 4)
        })

        return results
