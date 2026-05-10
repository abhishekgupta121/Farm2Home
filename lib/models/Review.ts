import mongoose from "mongoose";
import "./Crop";
import "./User";

export interface IReview extends mongoose.Document {
  listingId: mongoose.Types.ObjectId;
  consumerId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>(
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
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
