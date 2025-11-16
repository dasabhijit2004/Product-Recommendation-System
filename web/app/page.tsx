import React from "react";

type Product = {
  id: string;
  name: string;
  score?: number;
};

async function getNewUserRecommendations(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/recommendations", {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.products ?? [];
}

export default async function HomePage() {
  const products = await getNewUserRecommendations();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">
          Recommended Products for You
        </h1>
        <p className="text-slate-300 mb-8">
          New user view – powered by ML backend (dummy for now).
        </p>

        {products.length === 0 ? (
          <p>No recommendations yet. Is the ML server running?</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-md"
              >
                <div className="h-40 w-full rounded-lg bg-gradient-to-br from-sky-500/10 to-emerald-500/10 mb-4" />
                <h2 className="font-semibold text-lg">{p.name}</h2>
                {p.score !== undefined && (
                  <p className="text-sm text-slate-400 mt-1">
                    Score: {p.score.toFixed(2)}
                  </p>
                )}
                <button className="mt-4 inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-1.5 text-sm font-medium text-slate-950 hover:bg-sky-400">
                  View details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
