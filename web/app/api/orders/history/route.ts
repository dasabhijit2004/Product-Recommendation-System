import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json([]);
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    await connectDB();

    const orders = await Order.find({
      userId: decoded.id,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(orders);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}