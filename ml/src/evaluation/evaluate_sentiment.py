import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from src.inference.sentiment_scorer import predict_sentiment_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import random

# Synthetic review dataset
positive_reviews = [
    "Absolutely loved it!", "Great quality product", "Amazing and useful",
    "Really happy with this purchase", "Exceeded my expectations",
    "Fantastic product!", "Will buy again", "Highly recommend"
]

negative_reviews = [
    "Very disappointing", "Poor quality", "Not worth the money",
    "Stopped working in a week", "Terrible experience",
    "I regret buying this", "Bad product", "Would not recommend"
]

def generate_dataset(n=300):
    reviews = []
    labels = []

    for _ in range(n):
        if random.random() < 0.6:  # 60% positives
            review = random.choice(positive_reviews)
            label = 1
        else:
            review = random.choice(negative_reviews)
            label = 0

        reviews.append(review)
        labels.append(label)

    return reviews, labels

def evaluate():
    print("Generating synthetic dataset...")
    reviews, y_true = generate_dataset(300)

    print("Predicting using your ML model...")
    y_pred = []
    for r in reviews:
        score = predict_sentiment_score(r)
        pred = 1 if score >= 0.5 else 0
        y_pred.append(pred)

    print("\n--- SENTIMENT MODEL EVALUATION ---")
    print("Accuracy:", round(accuracy_score(y_true, y_pred), 3))
    print("Precision:", round(precision_score(y_true, y_pred), 3))
    print("Recall:", round(recall_score(y_true, y_pred), 3))
    print("F1 Score:", round(f1_score(y_true, y_pred), 3))

if __name__ == "__main__":
    evaluate()
