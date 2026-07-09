"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const res = await fetch(
      "/api/orders/history"
    );

    const data = await res.json();

    setOrders(data);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">
        Order History
      </h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-slate-900 p-5 rounded-xl"
            >
              <p>
                Order ID:
                {" "}
                {order._id}
              </p>

              <p>
                Total:
                {" "}
                ₹{order.total}
              </p>

              <p>
                Items:
                {" "}
                {order.items.length}
              </p>

              <p>
                Date:
                {" "}
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}