import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Crop from "@/lib/models/Crop";

// GET /api/crops?pinCode=462001  → returns active crops for that pincode
// GET /api/crops?farmerId=xxx    → returns all crops for that farmer
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const pinCode = searchParams.get("pinCode");
    const farmerId = searchParams.get("farmerId");

    let query: any = {};
    if (pinCode) {
      query.pinCode = pinCode;
      // Allow both active and pre-booked crops to be discovered by consumers
      query.status = { $in: ["active", "pre-booked"] };
    }
    if (farmerId) {
      query.farmerId = farmerId;
    }

    const crops = await Crop.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ crops }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch crops" },
      { status: 500 }
    );
  }
}

// POST /api/crops → farmer uploads a new crop
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      farmerId,
      farmerName,
      farmName,
      farmerMobile,
      pinCode,
      cropName,
      category,
      listingType,
      pricePerKg,
      availableQuantityKg,
      description,
      harvestDate,
      imageUrl,
    } = body;

    const requiredFields = {
      farmerId: "Farmer ID",
      farmerName: "Farmer Name",
      pinCode: "Pincode",
      cropName: "Crop Name",
      category: "Category",
      pricePerKg: "Price per kg",
      availableQuantityKg: "Available Quantity",
      harvestDate: "Harvest Date"
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !body[key])
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const crop = await Crop.create({
      farmerId,
      farmerName,
      farmName: farmName || "",
      farmerMobile: farmerMobile || "",
      pinCode,
      cropName,
      category,
      listingType: listingType || "standard",
      pricePerKg: Number(pricePerKg),
      availableQuantityKg: Number(availableQuantityKg),
      description: description || "",
      harvestDate: new Date(harvestDate),
      imageUrl: imageUrl || "",
      status: listingType === "pre-list" ? "pre-booked" : "active",
    });

    return NextResponse.json(
      { message: "Crop listed successfully", crop },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Crop upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload crop" },
      { status: 500 }
    );
  }
}
