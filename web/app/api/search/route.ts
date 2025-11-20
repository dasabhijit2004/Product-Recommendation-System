import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = (searchParams.get("query") ?? "").toLowerCase();
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "12");

    const start = (page - 1) * limit;
    const end = start + limit;

    // Load catalog
    const filePath = path.join(process.cwd(), "..", "ml", "data", "processed", "product_catalog.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(raw);

    // Filter results
    const filtered = products.filter((p: any) =>
      p.name.toLowerCase().includes(query) ||
      p.categories.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query)
    );

    // Paginate filtered results
    const slice = filtered.slice(start, end);

    return NextResponse.json({
      query,
      page,
      hasMore: end < filtered.length,
      products: slice,
    });

  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
