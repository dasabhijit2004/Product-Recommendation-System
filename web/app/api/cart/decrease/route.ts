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

    const cart = await Cart.findOne({ userId });
    if (!cart) return NextResponse.json({ error: "cart empty" });

    const item = cart.items.find((i: any) => i.productId === productId);

    if (!item) return NextResponse.json({ error: "not found" });

    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i: any) => i.productId !== productId);
    }

    await cart.save();
    return NextResponse.json({ message: "updated" });

  } catch (err) {
    console.error("Cart Decrease Error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
