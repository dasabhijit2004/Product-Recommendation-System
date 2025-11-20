import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    products: { type: [String], default: [] }, // <-- IMPORTANT
  },
  { timestamps: true }
);

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", WishlistSchema);
