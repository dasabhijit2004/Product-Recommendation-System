import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "12");

    const start = (page - 1) * limit;
    const end = start + limit;

    // ⭐ FIX: Use absolute path (go up one folder)
    const filePath = path.join(
      process.cwd(),         // web/
      "..",                  // go out of web/
      "ml",
      "data",
      "processed",
      "product_catalog.json"
    );

    console.log("Loading catalog from:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("Catalog NOT FOUND!");
      return NextResponse.json({ error: "catalog missing" }, { status: 500 });
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(raw);

    console.log("Total products:", products.length);

    const slice = products.slice(start, end);

    return NextResponse.json({
      page,
      hasMore: end < products.length,
      products: slice,
    });
  } catch (err) {
    console.error("RECOMMEND API ERROR:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
