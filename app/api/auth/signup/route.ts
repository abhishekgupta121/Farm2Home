import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      name,
      address,
      pinCode,
      mobileNumber,
      aadhaarNumber,
      password,
      role,
      farmName,
    } = body;

    // Basic validation
    if (!name || !address || !pinCode || !mobileNumber || !aadhaarNumber || !password || !role) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    if (typeof address === 'object' && (!address.state || !address.city || !address.addressLine1)) {
       return NextResponse.json(
        { error: "Please provide complete address (State, City, Address Line 1)" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this mobile number already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      address,
      pinCode,
      mobileNumber,
      aadhaarNumber,
      password: hashedPassword,
      role,
      farmName: role === "farmer" ? farmName : undefined,
    });

    // Remove password from response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      mobileNumber: newUser.mobileNumber,
      role: newUser.role,
      pinCode: newUser.pinCode,
      farmName: newUser.farmName,
    };

    return NextResponse.json(
      { message: "User registered successfully", user: userResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
