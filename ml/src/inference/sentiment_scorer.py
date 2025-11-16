import joblib
import pandas as pd

MODEL_PATH = "models/sentiment/sentiment_model.pkl"

print("Loading sentiment model...")
model = joblib.load(MODEL_PATH)
print("Sentiment model loaded.")


def predict_sentiment_score(text):
    """Return probability of positive sentiment."""
    proba = model.predict_proba([text])[0]  # [neg, pos]
    return float(proba[1])
