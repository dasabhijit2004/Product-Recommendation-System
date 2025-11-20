"use client";

import { useEffect, useState } from "react";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function loadMore() {
    if (!hasMore) return;

    const res = await fetch(`/api/recommendations?page=${page}&limit=12`);
    const data = await res.json();

    setProducts((prev) => [...prev, ...data.products]);
    setHasMore(data.hasMore);
    setPage(page + 1);
  }

  const loaderRef = useInfiniteScroll(loadMore);

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Recommended for You</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.product_id} product={p} />
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="h-10 mt-10 text-center text-slate-400">
          Loading more…
        </div>
      )}
    </main>
  );
}
