import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Crop from "@/lib/models/Crop";
import User from "@/lib/models/User";
import mongoose from "mongoose";

// GET /api/crops?pinCode=462001&category=vegetable&sort=price_asc
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    let query: any = {};
    
    // 1. Basic params
    const pinCode = searchParams.get("pinCode");
    const farmerId = searchParams.get("farmerId");
    // Only apply pinCode filter if it's a valid 6-digit number
    if (pinCode && /^\d{6}$/.test(pinCode)) query.pinCode = pinCode;
    if (farmerId && mongoose.Types.ObjectId.isValid(farmerId)) {
      query.farmerId = new mongoose.Types.ObjectId(farmerId);
    }

    // Status filter rules:
    // - If fetching by farmerId: show ALL statuses (farmer sees their own pending/active/rejected)
    // - If fetching with ?status=: use the provided status (admin use)
    // - Default (consumer marketplace): only show active & pre-booked
    const statusParam = searchParams.get("status");
    if (farmerId) {
      // No status filter — farmers see all their listings regardless of status
    } else if (statusParam) {
      query.status = statusParam;
    } else {
      query.status = { $in: ["active", "pre-booked"] };
    }

    // 2. Category Filter
    const category = searchParams.get("category");
    if (category) {
      query.category = { $in: category.split(",") };
    }

    const subCategory = searchParams.get("subCategory");
    if (subCategory) {
      query.subCategory = { $in: subCategory.split(",") };
    }

    // 3. Location Filter (Better Search + Partial Pincode Match)
    const location = searchParams.get("location");
    if (location) {
      let pinSearch = location;
      // If it looks like a 6-digit pincode, use the first 4 digits for a broader regional search
      if (/^\d{6}$/.test(location)) {
        pinSearch = location.substring(0, 4);
      }

      query.$or = [
        { pinCode: { $regex: pinSearch, $options: "i" } },
        { location: { $regex: location, $options: "i" } }
      ];
    }

    // 4. Listing Type Filter
    const listingType = searchParams.get("listingType");
    if (listingType) {
      query.listingType = { $in: listingType.split(",") };
    }

    // 4. Price Filter
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      query.pricePerKg = {};
      if (minPrice) query.pricePerKg.$gte = Number(minPrice);
      if (maxPrice) query.pricePerKg.$lte = Number(maxPrice);
    }

    // 5. Verification & Organic Filters
    const verified = searchParams.get("verified");
    if (verified === "true") query.isVerifiedFarmer = true;

    const organic = searchParams.get("organic");
    if (organic === "true") query.isOrganic = true;

    // 6. Availability Filter
    const inStock = searchParams.get("inStock");
    if (inStock === "true") query.availableQuantityKg = { $gt: 0 };
    else if (inStock === "false") query.availableQuantityKg = 0;

    // 7. Search Filter (by farmerName)
    const search = searchParams.get("search");
    if (search) {
      query.farmerName = { $regex: search, $options: "i" };
    }

    // 8. Sorting
    const sortParam = searchParams.get("sort");
    let sortQuery: any = { createdAt: -1 }; // default newest
    
    if (sortParam === "price_asc") sortQuery = { pricePerKg: 1 };
    else if (sortParam === "price_desc") sortQuery = { pricePerKg: -1 };
    else if (sortParam === "popular") sortQuery = { availableQuantityKg: -1 }; // mockup for popular

    // Execute queries
    const totalCount = await Crop.countDocuments(query);
    const crops = await Crop.find(query).sort(sortQuery).skip(skip).limit(limit).populate("farmerId", "address");

    return NextResponse.json({ 
      crops, 
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });
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
      isOrganic,
      location,
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
      isOrganic: Boolean(isOrganic),
      location: location || "",
      status: "pending", // Default to pending for admin approval
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
