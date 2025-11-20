import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Not authenticated" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    await connectDB();

    let wishlist = await Wishlist.findOne({ userId });

    // Create wishlist if missing
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        products: [productId],
      });
      return NextResponse.json({ message: "added" });
    }

    // Safe array initialization
    if (!Array.isArray(wishlist.products)) wishlist.products = [];

    const exists = wishlist.products.includes(productId);

    if (exists) {
      await Wishlist.updateOne(
        { userId },
        { $pull: { products: productId } }
      );
      return NextResponse.json({ message: "removed" });
    }

    await Wishlist.updateOne(
      { userId },
      { $addToSet: { products: productId } }
    );

    return NextResponse.json({ message: "added" });

  } catch (err) {
    console.error("Wishlist Toggle Error:", err);
    return NextResponse.json({ error: "Toggle failed" }, { status: 500 });
  }
}
