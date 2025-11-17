import { NextRequest, NextResponse } from "next/server";

const ML_API_BASE = process.env.ML_API_BASE || "http://localhost:8000";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const limit = searchParams.get("limit") || "20";

    if (!query.trim()) {
      return NextResponse.json({ products: [] });
    }

    const mlRes = await fetch(
      `${ML_API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      { cache: "no-store" }
    );

    if (!mlRes.ok) {
      console.error("ML search failed", await mlRes.text());
      return NextResponse.json(
        { error: "ML search failed" },
        { status: 500 }
      );
    }

    const data = await mlRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
