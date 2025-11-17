import { NextResponse } from "next/server";
import UserInteraction from "@/models/UserInteraction";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, term } = await req.json();

    await UserInteraction.findOneAndUpdate(
      { userId },
      {
        $push: { searches: { term, searchedAt: new Date() } },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
