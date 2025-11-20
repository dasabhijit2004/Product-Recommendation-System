import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    await connectDB();

    await Cart.updateOne(
      { userId },
      { $pull: { items: { productId } } }
    );

    return NextResponse.json({ message: "removed" });

  } catch (err) {
    console.error("Cart Remove Error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
