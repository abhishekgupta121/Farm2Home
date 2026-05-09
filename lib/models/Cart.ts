import mongoose from "mongoose";

// Ensure Crop (and User) models are registered whenever Cart is imported (needed for populate)
import "./Crop";

export interface ICartItem {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

export interface ICart extends mongoose.Document {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new mongoose.Schema<ICartItem>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crop",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity can not be less than 1."],
  },
});

const CartSchema = new mongoose.Schema<ICart>(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // One cart per user
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
