import Link from "next/link";
import ViewTracker from "@/components/ViewTracker";
import BuyButton from "./BuyButton";
import Image from "next/image";

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  // Fetch real product data
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });

  const product = await res.json();

  if (product.error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  // ✔ FIX: correct key name + fallback
  // const imageUrl =
  //   product.image_url && product.image_url.trim() !== ""
  //     ? product.image_url
  //     : "/placeholder.png";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <ViewTracker productId={id} />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* IMAGE SECTION */}
        <div>
          <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={product.imageUrl || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div>
          <h1 className="text-4xl font-bold mb-3">{product.name}</h1>

          <p className="text-slate-400 mb-2 text-lg">Brand: {product.brand}</p>
          <p className="text-slate-400 mb-2">Manufacturer: {product.manufacturer}</p>
          <p className="text-slate-400 mb-2">Category: {product.categories}</p>

          {/* Rating */}
          <div className="flex items-center gap-4 mt-4">
            <p className="text-xl text-yellow-400 font-semibold">
              ⭐ {product.avg_rating.toFixed(1)}
            </p>
            <p className="text-slate-400">{product.num_reviews} reviews</p>
          </div>

          {/* Sentiment */}
          <p className="mt-4 text-slate-300 text-lg">
            <strong>Sentiment Score:</strong>{" "}
            {product.sentiment_score.toFixed(3)}
          </p>

          {/* Dummy Price */}
          <p className="text-3xl font-bold text-sky-400 mt-6">
            ₹{Math.floor(799 + Math.random() * 2000)}
          </p>

          {/* Description */}
          <p className="mt-6 text-slate-400 leading-relaxed">
            Detailed product description, specifications, and usage information
            will be added soon.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex gap-4">
            <BuyButton productId={id} />

            <Link
              href={`/recommend/contextual/${id}`}
              className="bg-emerald-500 px-4 py-2 rounded text-black hover:bg-emerald-400"
            >
              Similar Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
