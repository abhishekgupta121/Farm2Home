import mongoose from "mongoose";
import "./Crop";
import "./User";

export interface IOrder extends mongoose.Document {
  consumerId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    cropName: string;
    quantity: number;
    pricePerKg: number;
    total: number;
    farmerId: mongoose.Types.ObjectId;
  }[];
  totalAmount: number;
  paymentStatus: "paid" | "pending";
  orderStatus: "placed" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true },
        cropName: { type: String, required: true },
        quantity: { type: Number, required: true },
        pricePerKg: { type: Number, required: true },
        total: { type: Number, required: true },
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { 
      type: String, 
      enum: ["paid", "pending", "transferred_to_farmer"], 
      default: "pending" 
    },
    orderStatus: { 
      type: String, 
      enum: ["placed", "shipped", "delivered", "cancelled", "confirmed"], 
      default: "placed" 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
