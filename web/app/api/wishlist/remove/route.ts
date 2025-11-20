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

    await Wishlist.updateOne(
      { userId },
      { $pull: { products: productId } }  // 👈 FIXED (products not items)
    );

    return NextResponse.json({ message: "removed" });

  } catch (err) {
    console.error("Wishlist Remove Error:", err);
    return NextResponse.json({ error: "remove failed" }, { status: 500 });
  }
}
