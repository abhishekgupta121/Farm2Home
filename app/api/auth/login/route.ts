import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import fs from "fs";

function logDebug(message: string) {
  try {
    const logFile = "c:/Users/Abhishek Gupta/OneDrive/Desktop/newa/Farm2Home/login_debug.log";
    fs.appendFileSync(logFile, `${new Date().toISOString()} - ${message}\n`);
  } catch (e) {
    // ignore logging errors
  }
}


export async function POST(req: Request) {
  logDebug("POST /api/auth/login started");
  try {
    logDebug("Connecting to DB...");
    await dbConnect();
    logDebug("DB Connected");
    
    logDebug("Parsing request body...");
    const body = await req.json();
    logDebug(`Body parsed: ${JSON.stringify(body)}`);

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
    logDebug(`Finding user with mobile: ${mobileNumber}`);
    const user = await User.findOne({ mobileNumber });
    logDebug(`User found: ${user ? "Yes" : "No"}`);
    if (!user) {
      logDebug("User not found, returning 401");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    logDebug("Checking password...");
    const isMatch = await bcrypt.compare(password, user.password);
    logDebug(`Password match: ${isMatch}`);
    if (!isMatch) {
      logDebug("Password mismatch, returning 401");
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

    logDebug(`Login successful for user: ${user._id}`);
    return NextResponse.json(
      { message: "Login successful", user: userResponse },
      { status: 200 }
    );
  } catch (error: any) {
    logDebug(`Login error: ${error.message}\nStack: ${error.stack}`);
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong during login" },
      { status: 400 }
    );
  }
}
