import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/lib/models/Review";
import mongoose from "mongoose";

// GET /api/reviews?farmerId=...
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId || !mongoose.Types.ObjectId.isValid(farmerId)) {
      return NextResponse.json({ error: "Valid Farmer ID is required" }, { status: 400 });
    }

    const reviews = await Review.find({ farmerId })
      .populate("listingId", "cropName")
      .populate("consumerId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { listingId, consumerId, farmerId, rating, comment } = body;

    if (!listingId || !consumerId || !farmerId || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await Review.create({
      listingId,
      consumerId,
      farmerId,
      rating,
      comment,
    });

    return NextResponse.json({ message: "Review submitted successfully", review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
