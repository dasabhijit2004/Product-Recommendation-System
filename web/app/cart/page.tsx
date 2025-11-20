"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  async function loadCart() {
    const res = await fetch("/api/cart/get");
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function increase(productId: string) {
    await fetch("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    loadCart();
  }

  async function decrease(productId: string) {
    await fetch("/api/cart/decrease", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    loadCart();
  }

  async function removeItem(productId: string) {
    await fetch("/api/cart/remove", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    loadCart();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-slate-400">Cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.product_id}
              className="flex gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">

              <Image
                src={item.image_url || "/placeholder.png"}
                width={120}
                height={120}
                alt={item.name}
                className="rounded"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-sm text-slate-400">{item.brand}</p>

                <p className="text-green-400 font-semibold mt-2">
                  ₹{item.price.toLocaleString()}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => decrease(item.product_id)}
                    className="bg-red-500 px-3 py-1 rounded">-</button>

                  <span className="text-lg">{item.quantity}</span>

                  <button onClick={() => increase(item.product_id)}
                    className="bg-green-500 px-3 py-1 rounded">+</button>
                </div>

                <p className="text-slate-300 mt-2">
                  Total: ₹{item.totalPrice.toLocaleString()}
                </p>

                <button
                  onClick={() => removeItem(item.product_id)}
                  className="mt-2 text-red-400 underline">
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right text-2xl font-bold mt-6">
            Grand Total: ₹{total.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
