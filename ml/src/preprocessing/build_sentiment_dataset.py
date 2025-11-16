import pandas as pd
import os
from sklearn.model_selection import train_test_split

RAW_DATA_DIR = "data/raw/kaggle_sentiment"
PROCESSED_DATA_DIR = "data/processed"


def load_kaggle_dataset():
    file_path = os.path.join(RAW_DATA_DIR, "sample30.csv")
    if not os.path.exists(file_path):
        raise FileNotFoundError("sample30.csv not found in raw/kaggle_sentiment/")
    
    print(f"Loaded dataset: {file_path}")
    return pd.read_csv(file_path, encoding="latin-1")


def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower().replace("\n", " ").strip()
    return text


def build_sentiment_dataset():
    df = load_kaggle_dataset()

    # Check required columns
    if "reviews_text" not in df.columns:
        raise Exception("reviews_text column missing.")

    if "user_sentiment" not in df.columns:
        raise Exception("user_sentiment column missing.")

    # Keep only relevant fields
    df = df[["reviews_text", "reviews_rating", "user_sentiment"]]

    df.rename(
        columns={"reviews_text": "review", "reviews_rating": "rating"},
        inplace=True,
    )

    # Clean review text
    df["review"] = df["review"].apply(clean_text)

    # Convert sentiment to numeric
    df["sentiment"] = df["user_sentiment"].map({"Positive": 1, "Negative": 0})
    df.dropna(subset=["sentiment"], inplace=True)

    # Select final fields
    df = df[["review", "rating", "sentiment"]]

    # Train/test split
    train, test = train_test_split(df, test_size=0.2, random_state=42)

    # Save
    os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
    train.to_csv(os.path.join(PROCESSED_DATA_DIR, "sentiment_train.csv"), index=False)
    test.to_csv(os.path.join(PROCESSED_DATA_DIR, "sentiment_test.csv"), index=False)

    print("Processed dataset saved successfully!")


if __name__ == "__main__":
    build_sentiment_dataset()
