import React from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

export type Product = {
  product_id: string;
  name: string;
  brand: string;
  manufacturer?: string;
  categories: string;
  avg_rating: number;
  num_reviews?: number;
  sentiment_score: number;
  final_score?: number;
  image_url: string;
};


async function getNewUserRecommendations(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/recommendations", {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch recommendations");
    return [];
  }

  const data = await res.json();
  return data.products ?? [];
}

export default async function HomePage() {
  const products: Product[] = await getNewUserRecommendations();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">
          Recommended Products for You
        </h1>

        <p className="text-slate-300 mb-8">
          New user view – powered by real ML sentiment model.
        </p>

        {/* If no products */}
        {products.length === 0 ? (
          <p>No recommendations yet. Is the ML server running?</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.map((p: Product) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
