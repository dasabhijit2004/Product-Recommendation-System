"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }: any) {
  const [wishlisted, setWishlisted] = useState(false);

  const imageUrl =
    product.image_url && product.image_url.trim() !== ""
      ? product.image_url
      : "/placeholder.png";

  return (
    <div className="group relative rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-md hover:shadow-lg transition-all p-4">

      {/* Wishlist Button */}
      <button
        onClick={() => setWishlisted(!wishlisted)}
        className="absolute top-3 right-3 bg-black/40 p-1.5 rounded-full hover:bg-black/60 transition"
      >
        <Heart
          className={`w-5 h-5 ${
            wishlisted ? "fill-red-500 text-red-500" : "text-white"
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
        <Image
          src={imageUrl}
          alt={product.name}
          width={600}
          height={600}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Title */}
      <h2 className="font-semibold text-lg line-clamp-2">{product.name}</h2>

      {/* Brand */}
      <p className="text-sm text-slate-400">{product.brand}</p>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-2">
        <Star className="w-4 h-4 text-yellow-400" />
        <p className="text-sm text-yellow-400">
          {product.avg_rating?.toFixed(1)}
        </p>
        <p className="text-xs text-slate-500">({product.num_reviews})</p>
      </div>

      {/* Dummy Price */}
      <p className="text-xl font-bold mt-2 text-sky-400">
        ₹{Math.floor(499.00 + Math.random() * 1500)}
      </p>

      {/* CTA */}
      <Link
        href={`/product/${product.product_id}`}
        className="mt-4 inline-flex items-center justify-center w-full rounded-md bg-sky-500 text-black px-4 py-2 text-sm font-medium hover:bg-sky-400 transition"
      >
        View Details
      </Link>
    </div>
  );
}
