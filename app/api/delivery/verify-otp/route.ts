import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { orderId, otp, type } = body;

    if (!orderId || !otp || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type !== "pickup" && type !== "delivery") {
      return NextResponse.json({ error: "Invalid verification type" }, { status: 400 });
    }

    // Clean the orderId input (remove spaces, #, and 'ORDER')
    const cleanOrderId = orderId.replace(/ORDER|#/gi, '').replace(/\s/g, '');

    let order;
    if (cleanOrderId.length === 24) {
      order = await Order.findById(cleanOrderId);
    } else {
       // Search by regex for the end of the ObjectId.
       const allOrders = await Order.find({});
       order = allOrders.find(o => o._id.toString().toLowerCase().endsWith(cleanOrderId.toLowerCase()));
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found. Please check the ID." }, { status: 404 });
    }

    // Support legacy orders during hackathon testing
    const validFarmerOtp = order.farmerOtp || "123456";
    const validConsumerOtp = order.consumerOtp || "654321";

    if (type === "pickup") {
      if (order.orderStatus !== "placed") {
        return NextResponse.json({ error: "Order is not ready for pickup or already picked up" }, { status: 400 });
      }
      if (validFarmerOtp !== otp) {
        return NextResponse.json({ error: "Invalid Farmer OTP" }, { status: 400 });
      }
      
      order.orderStatus = "shipped";
      await order.save();
      return NextResponse.json({ message: "Pickup verified successfully! Order is now shipped." }, { status: 200 });
    }

    if (type === "delivery") {
      if (order.orderStatus !== "shipped") {
        return NextResponse.json({ error: "Order is not in shipped status" }, { status: 400 });
      }
      if (validConsumerOtp !== otp) {
        return NextResponse.json({ error: "Invalid Consumer OTP" }, { status: 400 });
      }
      
      order.orderStatus = "delivered";
      // We don't release payment automatically here; admin will do it via the dashboard,
      // OR we could release it. The prompt says "admin panel the order it is showing order scuccessfully deleeiverd".
      // Let's just update the status as requested.
      await order.save();
      return NextResponse.json({ message: "Delivery verified successfully! Order is now delivered." }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify OTP" }, { status: 500 });
  }
}
