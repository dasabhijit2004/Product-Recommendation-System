import { cookies } from "next/headers";
import Link from "next/link";
import jwt from "jsonwebtoken";

type HistoryType = {
  views: { productId: string; viewedAt: string }[];
  searches: { term: string; searchedAt: string }[];
  purchases: { productId: string; purchasedAt: string }[];
};

type RecommendedProduct = {
  id: string;
  name: string;
  score?: number;
  sentiment_score?: number;
  final_score?: number;
};

export default async function ExistingUserRecommendations() {
  // -------------------------------
  // 1. Extract user ID from cookie
  // -------------------------------
  const token = cookies().get("token")?.value || null;
  let userId: string | null = null;

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      userId = decoded.id;
    } catch {
      userId = null;
    }
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 p-10">
        <h1 className="text-3xl font-bold mb-4">
          Existing User Recommendations
        </h1>
        <p>You must be logged in to see personalized recommendations.</p>
      </div>
    );
  }

  // -------------------------------
  // 2. Fetch full user history
  // -------------------------------
  const historyRes = await fetch(
    `http://localhost:3000/api/user/history/${userId}`,
    { cache: "no-store" }
  );

  const historyData = await historyRes.json();
  const history: HistoryType = historyData.history ?? {
    views: [],
    searches: [],
    purchases: [],
  };

  // -------------------------------
  // 3. Prepare ML request payload
  // -------------------------------
  const recentProductIds = [
    ...history.views.map((v) => v.productId),
    ...history.purchases.map((p) => p.productId),
  ];

  const recentSearchTerms = history.searches.map((s) => s.term);

  // -------------------------------
  // 4. Call ML backend to get recommendations
  // -------------------------------
  const mlRes = await fetch(
    "http://localhost:8000/recommend/existing-user",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        recent_product_ids: recentProductIds,
        recent_search_terms: recentSearchTerms,
      }),
    }
  );

  let recommendedProducts: RecommendedProduct[] = [];
  try {
    const mlData = await mlRes.json();
    recommendedProducts = mlData.products ?? [];
  } catch {
    recommendedProducts = [];
  }

  // -------------------------------
  // 5. Render page
  // -------------------------------
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">
          Personalized Recommendations
        </h1>

        <p className="text-slate-400 mb-8">
          Based on your viewing, searching, and purchasing history.
        </p>

        {recommendedProducts.length === 0 ? (
          <p>No personalized recommendations available yet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {recommendedProducts.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-md"
              >
                {/* Placeholder product image */}
                <div className="h-40 w-full rounded-lg bg-gradient-to-br from-sky-500/10 to-emerald-500/10 mb-4" />

                <h2 className="font-semibold text-lg">{p.name}</h2>

                {p.final_score && (
                  <p className="text-sm text-slate-400 mt-1">
                    Final Score: {p.final_score.toFixed(3)}
                  </p>
                )}

                <Link
                  href={`/product/${p.id}`}
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-1.5 text-sm font-medium text-slate-950 hover:bg-sky-400"
                >
                  View Product
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
