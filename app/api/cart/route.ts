import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";
import Crop from "@/lib/models/Crop"; // Required for populate() to know the schema
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

// Helper to get userId from Authorization header (JWT or direct)
export const getUserIdFromAuth = (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // For hackathon/demo compatibility, allow passing userId directly if no JWT
    const userIdHeader = req.headers.get("x-user-id");
    if (userIdHeader) return userIdHeader;
    return null;
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    return decoded.id || decoded._id;
  } catch (error) {
    // Fallback for demo
    const userIdHeader = req.headers.get("x-user-id");
    if (userIdHeader) return userIdHeader;
    return null;
  }
};

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const userId = getUserIdFromAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: {
        path: "farmerId",
        select: "address"
      }
    });
    
    if (!cart) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error: any) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
