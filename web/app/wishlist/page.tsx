"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadWishlist() {
    const res = await fetch("/api/wishlist/get", { cache: "no-store" });
    const data = await res.json();

    setItems(data.wishlist || []);
    setLoading(false);
  }

  async function removeItem(productId: string) {
    await fetch("/api/wishlist/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    loadWishlist(); // refresh UI
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading) {
    return <p className="text-white p-8">Loading wishlist…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-white p-10">
        <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {items.map((p) => (
          <div key={p.product_id} className="relative">
            <ProductCard product={p} />

            <button
              onClick={() => removeItem(p.product_id)}
              className="text-red-400 underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
