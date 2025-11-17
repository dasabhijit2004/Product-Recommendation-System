"use client";

import jwt from "jsonwebtoken";

export default function BuyButton({ productId }: { productId: string }) {
  async function handlePurchase() {
    // Get token from browser cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    let userId: string | null = null;

    if (token) {
      try {
        const decoded: any = jwt.decode(token);
        userId = decoded?.id;
      } catch {}
    }

    if (userId) {
      await fetch("/api/user/track/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
    }

    alert("Purchase recorded! (Simulated)");
  }

  return (
    <button
      onClick={handlePurchase}
      className="bg-emerald-500 px-4 py-2 rounded text-black hover:bg-emerald-400"
    >
      Buy Now
    </button>
  );
}
