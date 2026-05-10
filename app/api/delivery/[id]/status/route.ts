import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Delivery from "@/lib/models/Delivery";

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  confirmed: "Order Confirmed",
  in_transit: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { status, note } = body;

    const validStatuses = ["pending", "confirmed", "in_transit", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    delivery.status = status;
    delivery.timeline.push({
      stage: STATUS_LABELS[status] || status,
      timestamp: new Date(),
      note: note || "",
    });

    await delivery.save();

    return NextResponse.json({ message: "Status updated", delivery }, { status: 200 });
  } catch (error: any) {
    console.error("Delivery status PUT error:", error);
    return NextResponse.json({ error: "Failed to update delivery status" }, { status: 500 });
  }
}
