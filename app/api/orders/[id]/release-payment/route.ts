import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const orderId = params.id;

    // 1. Fetch Order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.orderStatus === "delivered" || order.paymentStatus === "transferred_to_farmer") {
      return NextResponse.json({ error: "Payment already released" }, { status: 400 });
    }

    // 2. Find Admin (The Escrow holder)
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return NextResponse.json({ error: "Admin account not found" }, { status: 500 });
    }

    // 3. Release funds to Farmers
    // For simplicity, we loop through items and pay each farmer
    for (const item of order.items) {
      const farmer = await User.findById(item.farmerId);
      if (farmer) {
        // Transfer from Admin to Farmer
        admin.walletBalance -= item.total;
        farmer.walletBalance += item.total;
        await farmer.save();
      }
    }

    // 4. Finalize Admin and Order Status
    await admin.save();
    order.paymentStatus = "transferred_to_farmer";
    order.orderStatus = "delivered";
    await order.save();

    return NextResponse.json({ 
      message: "Payment released to farmers successfully", 
      newAdminBalance: admin.walletBalance 
    });

  } catch (error: any) {
    console.error("Payment release error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
