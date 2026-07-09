import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const userId = decoded.id;

    await connectDB();

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart empty" },
        { status: 400 }
      );
    }

    // Load catalog
    const catalogPath = path.join(
      process.cwd(),
      "..",
      "ml",
      "data",
      "processed",
      "product_catalog.json"
    );

    const products = JSON.parse(
      fs.readFileSync(catalogPath, "utf8")
    );

    let total = 0;

    for (const item of cart.items) {
      const product = products.find(
        (p: any) => p.product_id === item.productId
      );

      if (!product) continue;

      total +=
        (product.price || 0) *
        item.quantity;
    }

    const order = await Order.create({
      userId,
      items: cart.items,
      total,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    return NextResponse.json({
      success: true,
      orderId: order._id,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}