import { NextResponse } from "next/server";
import UserInteraction from "@/models/UserInteraction";
import { connectDB } from "@/lib/db";

export async function GET(req: Request, { params }: any) {
  try {
    await connectDB();
    const { id } = params;

    const history = await UserInteraction.findOne({ userId: id }).lean();

    return NextResponse.json({ history });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ history: null }, { status: 500 });
  }
}
