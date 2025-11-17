// web/app/search/page.tsx
import Link from "next/link";
import Image from "next/image";

export type SearchProduct = {
  product_id: string;
  name: string;
  brand: string;
  manufacturer: string;
  categories: string;
  avg_rating: number;
  num_reviews: number;
  sentiment_score: number;
  image_url?: string;
  similarity?: number;
};

export default async function SearchPage(props: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query = "" } = await props.searchParams;

  let products: SearchProduct[] = [];

  if (query && query.trim().length > 0) {
    const res = await fetch(
      `http://localhost:3000/api/search?query=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      products = data.products ?? [];
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Search results for: "{query}"</h1>

        {(!query || !query.trim()) && (
          <p className="text-slate-400">
            Type something in the search bar to find products.
          </p>
        )}

        {query && query.trim() && products.length === 0 && (
          <p className="text-slate-400 mt-4">No matching products found.</p>
        )}

        {products.length > 0 && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
            {products.map((p) => (
              <Link
                key={p.product_id}
                href={`/product/${p.product_id}`}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-md hover:border-sky-500/60 transition"
              >
                <div className="w-full h-40 relative rounded-lg overflow-hidden mb-3">
                  <Image
                    src={p.image_url || "/placeholder.png"}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h2 className="font-semibold text-lg line-clamp-2">{p.name}</h2>
                <p className="text-sm text-slate-400 mt-1">Brand: {p.brand}</p>
                <p className="text-sm text-slate-400 mt-1">
                  Rating: {p.avg_rating.toFixed(1)} ({p.num_reviews} reviews)
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Sentiment: {p.sentiment_score.toFixed(3)}
                </p>
                {p.similarity !== undefined && (
                  <p className="text-xs text-emerald-400 mt-1">
                    Match: {(p.similarity * 100).toFixed(1)}%
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
