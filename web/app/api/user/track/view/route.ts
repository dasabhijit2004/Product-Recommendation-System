import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    // ⭐ Next.js 14 FIX: cookies() must be awaited
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let userId: string | null = null;

    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        userId = decoded.id;
      } catch (err) {
        console.error("JWT verify failed:", err);
      }
    }

    console.log("Track view:", { userId, productId });

    // TODO: Save to MongoDB
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Track view error", err);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
