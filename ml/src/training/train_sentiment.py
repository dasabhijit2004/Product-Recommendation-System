import pandas as pd
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

PROCESSED_DATA_DIR = "data/processed"
MODEL_DIR = "models/sentiment"


def train_sentiment():
    train_path = os.path.join(PROCESSED_DATA_DIR, "sentiment_train.csv")
    test_path = os.path.join(PROCESSED_DATA_DIR, "sentiment_test.csv")

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    X_train = train_df["review"]
    y_train = train_df["sentiment"]

    X_test = test_df["review"]
    y_test = test_df["sentiment"]

    # TF-IDF + Logistic Regression Pipeline
    clf = Pipeline(
        [
            ("tfidf", TfidfVectorizer(max_features=20000)),
            ("lr", LogisticRegression(max_iter=300)),
        ]
    )

    print("Training sentiment classifier...")
    clf.fit(X_train, y_train)

    print("Evaluating...")
    accuracy = clf.score(X_test, y_test)
    print(f"Test Accuracy: {accuracy:.4f}")

    # Save model
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(clf, os.path.join(MODEL_DIR, "sentiment_model.pkl"))
    print("Model saved to models/sentiment/sentiment_model.pkl")


if __name__ == "__main__":
    train_sentiment()
