import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Crop from "@/lib/models/Crop";
import "@/lib/models/User"; // register User model for Crop's farmerId ref

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["active", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedCrop = await Crop.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedCrop) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Crop status updated", crop: updatedCrop }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating crop status:", error);
    return NextResponse.json({ error: "Failed to update crop status" }, { status: 500 });
  }
}
