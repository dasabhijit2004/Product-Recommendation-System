import Link from "next/link";

type ContextualProduct = {
  id: string;
  name: string;
  final_score?: number;
};

type ContextualResponse = {
  product_id: string;
  similar: ContextualProduct[];
  accessories: ContextualProduct[];
};

async function getContextualRecommendations(productId: string) {
  const res = await fetch("http://localhost:8000/recommend/contextual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ product_id: productId }),
  });

  if (!res.ok) {
    console.error("ML API Error");
    return null;
  }

  const data: ContextualResponse = await res.json();
  return data;
}

export default async function ContextualPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const rec = await getContextualRecommendations(id);

  if (!rec) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 p-10">
        <p>Failed to load recommendations.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-10">
      <h1 className="text-3xl font-bold mb-6">
        Recommendations Based on "{id}"
      </h1>

      {/* SIMILAR PRODUCTS */}
      <h2 className="text-xl font-semibold mb-3">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {rec.similar.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow"
          >
            <div className="h-40 bg-gradient-to-br from-sky-600/10 to-blue-400/10 rounded mb-3" />
            <h3 className="font-semibold">{p.name}</h3>

            {p.final_score && (
              <p className="text-slate-400 text-sm">
                Score: {p.final_score.toFixed(3)}
              </p>
            )}

            <Link
              href={`/product/${p.id}`}
              className="mt-3 inline-block bg-sky-500 hover:bg-sky-400 text-black px-3 py-1.5 rounded"
            >
              View Product
            </Link>
          </div>
        ))}
      </div>

      {/* ACCESSORIES */}
      <h2 className="text-xl font-semibold mb-3">Related Accessories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rec.accessories.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow"
          >
            <div className="h-40 bg-gradient-to-br from-emerald-500/10 to-green-400/10 rounded mb-3" />
            <h3 className="font-semibold">{p.name}</h3>

            <Link
              href={`/product/${p.id}`}
              className="mt-3 inline-block bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded"
            >
              View Product
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
