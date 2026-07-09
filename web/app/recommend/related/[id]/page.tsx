import Link from "next/link";

async function getRelatedProducts(id: string) {
  const res = await fetch(
    "http://localhost:8000/recommend/related",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        product_id: id,
      }),
    }
  );

  return res.json();
}

export default async function RelatedPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const data = await getRelatedProducts(id);

  console.log("RELATED DATA:", data);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">
        Frequently Bought Together
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.related?.map((p: any) => (
          <div
            key={p.id}
            className="bg-slate-900 p-4 rounded-xl border border-slate-800"
          >
            <h2 className="font-semibold">
              {p.name}
            </h2>

            <Link
              href={`/product/${p.id}`}
              className="mt-3 inline-block bg-sky-500 px-3 py-2 rounded text-black"
            >
              View Product
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}