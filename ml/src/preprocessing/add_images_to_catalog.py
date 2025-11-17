import json
import os

CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")

INPUT = "data/processed/product_catalog.json"
OUTPUT = "data/processed/product_catalog.json"

def generate_image_url(product_name: str):
    safe_name = product_name.replace(" ", "%20")
    return (
        f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/"
        f"w_600,h_600,c_fill,l_text:Arial_40:{safe_name}/product.png"
    )

def add_images():
    if not os.path.exists(INPUT):
        raise FileNotFoundError(f"{INPUT} not found")

    with open(INPUT, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    for p in catalog:
        p["image_url"] = generate_image_url(p["name"])

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print(f"Updated catalog with images → {OUTPUT}")

if __name__ == "__main__":
    add_images()
