import mongoose from "mongoose";

// Ensure User model is registered whenever Crop is imported (needed for populate)
import "./User";

export interface ICrop extends mongoose.Document {
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  farmName: string;
  farmerMobile: string;
  pinCode: string;
  cropName: string;
  category: "vegetable" | "fruit" | "grain" | "pulses" | "spice" | "other";
  subCategory?: string;
  listingType: "standard" | "ugly-sell" | "pre-list";
  pricePerKg: number;
  availableQuantityKg: number;
  description: string;
  harvestDate: Date;
  status: "pending" | "active" | "sold" | "pre-booked" | "rejected" | "paused";
  imageUrl?: string;
  isOrganic: boolean;
  isVerifiedFarmer: boolean;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const CropSchema = new mongoose.Schema<ICrop>(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerName: { type: String, required: true },
    farmName: { type: String, default: "" },
    farmerMobile: { type: String, required: true },
    pinCode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Please provide a valid 6-digit PIN code"],
    },
    cropName: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["vegetable", "fruit", "grain", "pulses", "spice", "other"],
    },
    subCategory: { type: String, default: "" },
    listingType: {
      type: String,
      required: true,
      enum: ["standard", "ugly-sell", "pre-list"],
      default: "standard",
    },
    pricePerKg: { type: Number, required: true, min: 0 },
    availableQuantityKg: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    harvestDate: { type: Date, required: true },
    imageUrl: { type: String, default: "" },
    status: {
      type: String,
      required: true,
      enum: ["pending", "active", "sold", "pre-booked", "rejected", "paused"],
      default: "pending",
    },
    isOrganic: { type: Boolean, default: false },
    isVerifiedFarmer: { type: Boolean, default: false },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

// Force model recreation in development to apply schema changes
if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Crop;
}

export default mongoose.models.Crop || mongoose.model<ICrop>("Crop", CropSchema);

