// UNIQUE_ID: CLEAN_FILE_v2
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Crop from "@/lib/models/Crop";
import User from "@/lib/models/User";
import Cart from "@/lib/models/Cart";
import mongoose from "mongoose";

const MOCK_CONSUMER_ID = "000000000000000000000001";

// GET /api/orders?farmerId=... or ?consumerId=...
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId");
    const consumerId = searchParams.get("consumerId");
    const isAdmin = searchParams.get("admin") === "true";

    let filter = {};
    let queryConsumerId = consumerId;
    if (consumerId === "admin-mock-id") {
      queryConsumerId = MOCK_CONSUMER_ID;
    }

    if (isAdmin) {
      filter = {}; // Admin sees all
    } else if (farmerId && mongoose.Types.ObjectId.isValid(farmerId)) {
      filter = { "items.farmerId": farmerId };
    } else if (queryConsumerId && mongoose.Types.ObjectId.isValid(queryConsumerId)) {
      filter = { consumerId: queryConsumerId };
    } else {
      return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    }

    const orders = await Order.find(filter)
      .populate("items.productId", "cropName pricePerKg")
      .populate("consumerId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, items, totalAmount } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // 1. Fetch User and Check Balance
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.walletBalance < totalAmount) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
    }

    // 2. Find or Auto-Create Admin for Escrow
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      // Create a default admin if none exists to prevent system failure
      admin = await User.create({
        name: "Super Admin",
        mobileNumber: "0000000000",
        password: "password_placeholder", // Will be hashed if logged in properly
        role: "admin",
        aadhaarNumber: "000000000000",
        pinCode: "000000",
        address: "System HQ",
        walletBalance: 0,
      });
    }

    // 3. Create the Order
    const newOrder = await Order.create({
      consumerId: userId,
      items: items.map((item: any) => ({
        productId: item.productId._id,
        cropName: item.productId.cropName,
        quantity: item.quantity,
        pricePerKg: item.productId.pricePerKg,
        total: item.productId.pricePerKg * item.quantity,
        farmerId: item.productId.farmerId,
      })),
      totalAmount,
      paymentStatus: "paid", // Paid to admin (escrow)
      orderStatus: "placed",
    });

    // 4. Deduct Consumer Wallet & Add to Admin Wallet (Escrow)
    user.walletBalance -= totalAmount;
    await user.save();

    admin.walletBalance += totalAmount;
    await admin.save();

    // 5. Update Crop Quantities (Deduct stock)
    for (const item of items) {
        await Crop.findByIdAndUpdate(item.productId._id, {
            $inc: { availableQuantityKg: -item.quantity }
        });
    }

    // 6. Clear User's Cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    return NextResponse.json({ 
      message: "Order placed successfully. Funds held in escrow.", 
      order: newOrder,
      newBalance: user.walletBalance 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to place order" }, { status: 500 });
  }
}
