import mongoose, { Schema, models, model } from "mongoose";

const InteractionSchema = new Schema(
  {
    userId: { type: String, required: true },

    views: [
      {
        productId: String,
        viewedAt: Date,
      },
    ],

    searches: [
      {
        term: String,
        searchedAt: Date,
      },
    ],

    purchases: [
      {
        productId: String,
        purchasedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default models.UserInteraction ||
  model("UserInteraction", InteractionSchema);
