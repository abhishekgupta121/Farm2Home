import mongoose from "mongoose";
import "./User"; // register User for populate

export interface IDeliveryTimeline {
  stage: string;
  timestamp: Date;
  note?: string;
}

export interface IDelivery extends mongoose.Document {
  consumerId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  cropId: mongoose.Types.ObjectId;
  method: "home_delivery" | "farm_pickup" | "express_delivery";
  status: "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled";
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pinCode: string;
  };
  charges: number;
  estimatedDeliveryDate?: Date;
  timeline: IDeliveryTimeline[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineSchema = new mongoose.Schema<IDeliveryTimeline>({
  stage: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: "" },
});

const DeliverySchema = new mongoose.Schema<IDelivery>(
  {
    consumerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true },
    method: {
      type: String,
      required: true,
      enum: ["home_delivery", "farm_pickup", "express_delivery"],
      default: "home_delivery",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
    address: {
      line1: { type: String, required: true },
      line2: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    charges: { type: Number, default: 0 },
    estimatedDeliveryDate: { type: Date },
    timeline: { type: [TimelineSchema], default: [] },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default (mongoose.models.Delivery as mongoose.Model<IDelivery>) ||
  mongoose.model<IDelivery>("Delivery", DeliverySchema);
