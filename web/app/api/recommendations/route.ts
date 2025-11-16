import { NextResponse } from "next/server";

const ML_API_BASE = process.env.ML_API_BASE || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${ML_API_BASE}/recommend/new-user`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch from ML service");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
