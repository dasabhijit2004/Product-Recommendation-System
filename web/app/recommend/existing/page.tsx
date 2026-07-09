import ProductCard from "@/components/ProductCard";
import fs from "fs";
import path from "path";

const previousPurchaseIds = [
  "AV13O1A8GV-KLJ3akUyj",
  "AV14LG0R-jtxr-f38QfS",
  "AV16khLE-jtxr-f38VFn",
];

async function getRecommendations() {
  const res = await fetch(
    "http://localhost:8000/recommend/existing-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        user_id: "demo-user",
        recent_product_ids: previousPurchaseIds,
        recent_search_terms: ["cup", "coffee", "mug"],
      }),
    }
  );

  const text = await res.text();

  console.log("ML Response:", text);

  if (!res.ok) {
    throw new Error(`ML API Error: ${text}`);
  }

  return JSON.parse(text);
}

export default async function ExistingUserPage() {

  // Load product catalog
  const catalogPath = path.join(
    process.cwd(),
    "..",
    "ml",
    "data",
    "processed",
    "product_catalog.json"
  );

  const catalog = JSON.parse(
    fs.readFileSync(catalogPath, "utf8")
  );

  // Previous purchased products
  const purchasedProducts = previousPurchaseIds
    .map((id) =>
      catalog.find((p: any) => p.product_id === id)
    )
    .filter(Boolean);

  // ML recommendations
  const recommendationData = await getRecommendations();

  const recommendedProducts = recommendationData.recommendations;

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-8 py-10">

        <h1 className="text-4xl font-bold mb-10">
          Existing User Recommendations
        </h1>

        {/* Previous Purchases */}

        <h2 className="text-2xl font-semibold mb-5">
          Your Previous Purchases
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-14">

          {purchasedProducts.map((product: any) => (
            <ProductCard
              key={product.product_id}
              product={product}
            />
          ))}

        </div>

        {/* Recommendations */}

        <h2 className="text-2xl font-semibold mb-5">
          Recommended For You
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendedProducts.map((product: any) => (
            <ProductCard
              key={product.product_id}
              product={product}
            />
          ))}
        </div>

      </div>

    </main>
  );
}