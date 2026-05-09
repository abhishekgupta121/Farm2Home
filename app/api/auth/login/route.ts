import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const { mobileNumber, password } = body;

    if (!mobileNumber || !password) {
      return NextResponse.json(
        { error: "Please provide mobile number and password" },
        { status: 400 }
      );
    }

    // Mock Admin Login
    if (mobileNumber === "0000000000" && password === "password") {
      return NextResponse.json(
        { 
          message: "Admin Login successful", 
          user: {
            _id: "admin-mock-id",
            name: "Super Admin",
            mobileNumber: "0000000000",
            role: "admin",
          } 
        },
        { status: 200 }
      );
    }

    // Find user
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      role: user.role,
      farmName: user.farmName,
      pinCode: user.pinCode,
      address: user.address,
    };

    return NextResponse.json(
      { message: "Login successful", user: userResponse },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong during login" },
      { status: 500 }
    );
  }
}
