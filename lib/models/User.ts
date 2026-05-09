import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  address: string;
  pinCode: string;
  mobileNumber: string;
  aadhaarNumber: string;
  password: string;
  role: "farmer" | "consumer";
  farmName?: string; // Optional, only for farmers
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    address: {
      type: String,
      required: [true, "Please provide an address"],
    },
    pinCode: {
      type: String,
      required: [true, "Please provide a PIN code"],
      match: [/^\d{6}$/, "Please provide a valid 6-digit PIN code"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Please provide a mobile number"],
      unique: true,
      match: [/^\d{10}$/, "Please provide a valid 10-digit mobile number"],
    },
    aadhaarNumber: {
      type: String,
      required: [true, "Please provide an Aadhaar number"],
      match: [/^\d{12}$/, "Please provide a valid 12-digit Aadhaar number"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    role: {
      type: String,
      required: true,
      enum: ["farmer", "consumer"],
    },
    farmName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
