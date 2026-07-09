"use client";

import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  async function placeOrder() {
    const res = await fetch(
      "/api/orders/checkout",
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Order placed successfully");

      router.push("/orders");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <button
        onClick={placeOrder}
        className="bg-green-500 text-black px-6 py-3 rounded"
      >
        Confirm Order
      </button>
    </div>
  );
}