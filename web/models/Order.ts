import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    items: [
      {
        productId: String,
        quantity: Number,
      },
    ],

    total: Number,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);