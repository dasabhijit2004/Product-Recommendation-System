import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ items: [], total: 0 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    await connectDB();

    const cart = await Cart.findOne({ userId }).lean();
    if (!cart || !cart.items) return NextResponse.json({ items: [], total: 0 });

    // Load catalog
    const catalogPath = path.join(
      process.cwd(),
      "..",
      "ml",
      "data",
      "processed",
      "product_catalog.json"
    );
    const products = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

    const mapped = cart.items
      .map((item: any) => {
        const product = products.find((p: any) => p.product_id === item.productId);
        if (!product) return null;

        return {
          ...product,
          quantity: item.quantity,
          totalPrice: product.price * item.quantity,
        };
      })
      .filter(Boolean);

    const total = mapped.reduce((sum, p) => sum + p.totalPrice, 0);

    return NextResponse.json({ items: mapped, total });

  } catch (err) {
    console.error("Cart Get Error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
