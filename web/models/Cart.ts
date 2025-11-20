import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Cart ||
  mongoose.model("Cart", CartSchema);