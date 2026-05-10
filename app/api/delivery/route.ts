import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Delivery from "@/lib/models/Delivery";
import "@/lib/models/User";
import "@/lib/models/Crop";

const DELIVERY_CHARGES: Record<string, number> = {
  home_delivery: 40,
  farm_pickup: 0,
  express_delivery: 100,
};

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { consumerId, farmerId, cropId, method, address, notes } = body;

    if (!consumerId || !farmerId || !cropId || !method || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const charges = DELIVERY_CHARGES[method] ?? 40;
    const etaMap: Record<string, number> = {
      home_delivery: 2,
      farm_pickup: 3,
      express_delivery: 0,
    };
    const daysToAdd = etaMap[method] ?? 2;
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + daysToAdd);

    const delivery = await Delivery.create({
      consumerId,
      farmerId,
      cropId,
      method,
      address,
      charges,
      estimatedDeliveryDate,
      notes: notes || "",
      timeline: [{ stage: "Order Placed", timestamp: new Date(), note: "Your delivery request has been received." }],
    });

    return NextResponse.json({ message: "Delivery created", delivery }, { status: 201 });
  } catch (error: any) {
    console.error("Delivery POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create delivery" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const consumerId = searchParams.get("consumerId");
    const farmerId = searchParams.get("farmerId");
    const admin = searchParams.get("admin");

    let query: any = {};
    if (consumerId) query.consumerId = consumerId;
    if (farmerId) query.farmerId = farmerId;
    // admin=true returns all

    const deliveries = await Delivery.find(query)
      .populate("consumerId", "name mobileNumber")
      .populate("farmerId", "name mobileNumber farmName")
      .populate("cropId", "cropName pricePerKg")
      .sort({ createdAt: -1 });

    return NextResponse.json({ deliveries }, { status: 200 });
  } catch (error: any) {
    console.error("Delivery GET error:", error);
    return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 });
  }
}
