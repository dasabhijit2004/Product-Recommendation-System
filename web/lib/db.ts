import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ Please add MONGODB_URI to .env.local");
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    // Already connected
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("🟢 MongoDB connected via Mongoose");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}