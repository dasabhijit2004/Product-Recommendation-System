"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }: any) {
  const [wishlisted, setWishlisted] = useState(false);

  const imageUrl =
    product.imageUrl ||
    product.image_url ||
    "/placeholder.png";

  async function toggleWishlist(e: any) {
    e.preventDefault(); // ❗ Prevent click from opening product page

    await fetch("/api/wishlist/toggle", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.product_id }),
    });

    setWishlisted(!wishlisted);
  }

  return (
    <Link
      href={`/product/${product.product_id}`}
      className="group relative rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-md hover:shadow-lg transition-all p-4 block"
    >
      {/* ❤️ Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-20 bg-black/40 p-1.5 rounded-full hover:bg-black/60 transition"
      >
        <Heart
          className={`w-5 h-5 ${
            wishlisted
              ? "fill-red-500 text-red-500"
              : "text-white"
          }`}
        />
      </button>

      {/* 🖼 Product Image */}
      <div className="w-full h-48 rounded-lg overflow-hidden mb-4 relative">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* 📌 Details */}
      <h2 className="font-semibold text-lg line-clamp-2">
        {product.name}
      </h2>

      <p className="text-sm text-slate-400">{product.brand}</p>

      {/* ⭐ Rating */}
      <div className="flex items-center gap-1 mt-2">
        <Star className="w-4 h-4 text-yellow-400" />
        <p className="text-sm text-yellow-400">
          {product.avg_rating?.toFixed(1)}
        </p>
        <p className="text-xs text-slate-500">
          ({product.num_reviews})
        </p>
      </div>

      {/* 💰 Price */}
      <p className="text-green-400 font-semibold mt-2">
        ₹{product.price?.toLocaleString() ?? "N/A"}
      </p>

      {/* CTA */}
      <div className="mt-4">
        <span className="inline-flex items-center justify-center w-full rounded-md bg-sky-500 text-black px-4 py-2 text-sm font-medium hover:bg-sky-400 transition">
          View Details
        </span>
      </div>
    </Link>
  );
}
