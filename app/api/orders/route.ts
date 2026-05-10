import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Crop from "@/lib/models/Crop";
import mongoose from "mongoose";

const MOCK_CONSUMER_ID = "000000000000000000000001";

// GET /api/orders?farmerId=... or ?consumerId=...
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId");
    const consumerId = searchParams.get("consumerId");

    let filter = {};
    let queryConsumerId = consumerId;
    if (consumerId === "admin-mock-id") {
      queryConsumerId = MOCK_CONSUMER_ID;
    }

    if (farmerId && mongoose.Types.ObjectId.isValid(farmerId)) {
      filter = { farmerId };
    } else if (queryConsumerId && mongoose.Types.ObjectId.isValid(queryConsumerId)) {
      filter = { consumerId: queryConsumerId };
    } else {
      return NextResponse.json({ error: "Valid Farmer ID or Consumer ID is required" }, { status: 400 });
    }

    const orders = await Order.find(filter)
      .populate("listingId", "cropName pricePerKg")
      .populate("consumerId", "name")
      .populate("farmerId", "name")
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
    const { listingId, consumerId, farmerId, quantity, totalPrice } = body;

    let validConsumerId = consumerId;
    if (consumerId === "admin-mock-id") {
      validConsumerId = MOCK_CONSUMER_ID;
    } else if (!mongoose.Types.ObjectId.isValid(consumerId)) {
      validConsumerId = new mongoose.Types.ObjectId();
    }

    let validFarmerId = farmerId;
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      validFarmerId = new mongoose.Types.ObjectId();
    }

    if (!listingId || !consumerId || !farmerId || !quantity || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Check stock
    const crop = await Crop.findById(listingId);
    if (!crop) {
      return NextResponse.json({ error: "Crop listing not found" }, { status: 404 });
    }

    if (crop.availableQuantityKg < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    // 2. Create order
    const order = await Order.create({
      listingId,
      consumerId: validConsumerId,
      farmerId: validFarmerId,
      quantity,
      totalPrice,
      status: "confirmed"
    });

    // 3. Reduce stock
    crop.availableQuantityKg -= quantity;
    await crop.save();

    return NextResponse.json({ message: "Order placed successfully", order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
