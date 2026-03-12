import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

print("Loading sentiment model...")
from src.inference.sentiment_scorer import predict_sentiment_score
print("Sentiment model loaded.")

KAGGLE_PATH = "data/raw/kaggle_sentiment/sample30.csv"

def evaluate():
    print(f"Loading Kaggle dataset: {KAGGLE_PATH}")

    df = pd.read_csv(KAGGLE_PATH, encoding="latin-1")
    
    # Ensure columns exist
    if "reviews_text" not in df.columns or "user_sentiment" not in df.columns:
        raise Exception("Kaggle dataset missing 'reviews_text' or 'user_sentiment' columns")

    # Clean text
    df["reviews_text"] = df["reviews_text"].astype(str).fillna("")

    # Convert sentiment to numeric
    df["label"] = df["user_sentiment"].map({"Positive": 1, "Negative": 0})
    df = df.dropna(subset=["label"])

    print(f"Total samples: {len(df)}")

    y_true = df["label"].tolist()
    y_pred = []

    print("Running predictions...")

    for review in df["reviews_text"]:
        score = predict_sentiment_score(str(review))   # probability 0–1
        pred = 1 if score >= 0.5 else 0
        y_pred.append(pred)

    # Convert to numpy
    y_true = np.array(y_true, dtype=int)
    y_pred = np.array(y_pred, dtype=int)

    # Metrics
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)

    print("\n===== SENTIMENT MODEL EVALUATION (Kaggle sample30.csv) =====")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    print("===========================================================")


if __name__ == "__main__":
    evaluate()
