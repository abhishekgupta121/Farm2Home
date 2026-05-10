import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import Crop from "@/lib/models/Crop";

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

    // Refund is only possible if funds are still with admin (escrow)
    if (order.paymentStatus !== "paid" || order.orderStatus === "delivered") {
      return NextResponse.json({ error: "Refund not possible. Funds already released or order completed." }, { status: 400 });
    }

    if (order.orderStatus === "cancelled") {
      return NextResponse.json({ error: "Order already cancelled/refunded" }, { status: 400 });
    }

    // 2. Find Admin (The Escrow holder) and Consumer
    const admin = await User.findOne({ role: "admin" });
    const consumer = await User.findById(order.consumerId);

    if (!admin || !consumer) {
      return NextResponse.json({ error: "System error: User accounts not found" }, { status: 500 });
    }

    // 3. Process Refund
    // Deduct from Admin, Add to Consumer
    admin.walletBalance -= order.totalAmount;
    consumer.walletBalance += order.totalAmount;

    // 4. Restore Stock to Crops
    for (const item of order.items) {
      await Crop.findByIdAndUpdate(item.productId, {
        $inc: { availableQuantityKg: item.quantity }
      });
    }

    // 5. Update Order Status
    order.orderStatus = "cancelled";
    order.paymentStatus = "pending"; // Reset or mark as refunded

    await admin.save();
    await consumer.save();
    await order.save();

    return NextResponse.json({ 
      message: "Order refunded successfully. Funds returned to your wallet.", 
      newWalletBalance: consumer.walletBalance 
    });

  } catch (error: any) {
    console.error("Refund error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
