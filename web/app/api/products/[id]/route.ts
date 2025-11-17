import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // ⭐ FIX

  try {
    const res = await fetch(`http://localhost:8000/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Failed" }, { status: 500 });
  }
}
