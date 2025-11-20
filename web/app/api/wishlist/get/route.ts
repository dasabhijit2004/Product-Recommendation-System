import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ wishlist: [] });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    await connectDB();

    const wishlist = await Wishlist.findOne({ userId }).lean();

    if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
      return NextResponse.json({ wishlist: [] });
    }

    // load product catalog
    const catalogPath = path.join(
      process.cwd(), "..", "ml", "data", "processed", "product_catalog.json"
    );

    const products = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

    const mapped = wishlist.products
      .map((id: string) =>
        products.find((p: any) => p.product_id === id)
      )
      .filter(Boolean);

    return NextResponse.json({ wishlist: mapped });

  } catch (err) {
    console.error("Wishlist Get Error:", err);
    return NextResponse.json(
      { error: "Failed to load wishlist" },
      { status: 500 }
    );
  }
}
