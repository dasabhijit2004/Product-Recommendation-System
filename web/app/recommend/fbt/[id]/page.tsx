import Link from "next/link";

async function getFBT(productId: string) {
  const res = await fetch(
    "http://localhost:8000/recommend/fbt",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
      }),
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function FBTPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const data = await getFBT(id);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">
        Frequently Bought Together
      </h1>

      {data.products.length === 0 ? (
        <p>No purchase history available yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {data.products.map((p: any) => (
            <div
              key={p.id}
              className="bg-slate-900 p-4 rounded-xl border border-slate-800"
            >
              <h2>{p.name}</h2>

              <p className="text-slate-400 mt-2">
                Bought Together {p.count} times
              </p>

              <Link
                href={`/product/${p.id}`}
                className="inline-block mt-3 bg-sky-500 text-black px-4 py-2 rounded"
              >
                View Product
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}