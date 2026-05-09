import mongoose from "mongoose";

export interface IContact extends mongoose.Document {
  fullName: string;
  phoneNumber: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new mongoose.Schema<IContact>(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide your phone number"],
    },
    message: {
      type: String,
      required: [true, "Please provide a message"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
