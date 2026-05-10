import mongoose from "mongoose";
import "./Crop";
import "./User";

export interface IOrder extends mongoose.Document {
  listingId: mongoose.Types.ObjectId;
  consumerId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}
export default mongoose.model<IOrder>("Order", OrderSchema);
