import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Crop from "@/lib/models/Crop";

// DELETE /api/crops/[id] → farmer deletes their listing
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deleted = await Crop.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Crop deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete crop" },
      { status: 500 }
    );
  }
}

// PUT /api/crops/[id] → farmer updates their listing
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const updated = await Crop.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Crop updated successfully", crop: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update crop" },
      { status: 500 }
    );
  }
}
