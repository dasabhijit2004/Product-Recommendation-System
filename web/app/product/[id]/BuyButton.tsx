"use client";

export default function BuyButton({ productId }: { productId: string }) {
  async function addToCart() {
    await fetch("/api/cart/add", {
      method: "POST",
      credentials: "include",       // ✔ REQUIRED
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    alert("Added to cart!");
  }

  return (
    <button
      onClick={addToCart}
      className="bg-blue-500 px-4 py-2 rounded text-black hover:bg-blue-400"
    >
      Add to Cart
    </button>
  );
}
