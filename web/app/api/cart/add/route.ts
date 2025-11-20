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

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity: 1 }]
      });
      return NextResponse.json({ message: "added" });
    }

    const item = cart.items.find((i: any) => i.productId === productId);

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();
    return NextResponse.json({ message: "added" });

  } catch (err) {
    console.error("Cart Add Error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
