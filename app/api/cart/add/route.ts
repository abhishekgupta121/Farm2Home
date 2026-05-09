import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";
import Crop from "@/lib/models/Crop";
import { getUserIdFromAuth } from "../route";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const userId = getUserIdFromAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Verify product exists and check stock
    const product = await Crop.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.availableQuantityKg < quantity) {
      return NextResponse.json({ error: "Not enough stock available" }, { status: 400 });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
      
      // Re-verify total quantity against stock
      if (product.availableQuantityKg < cart.items[itemIndex].quantity) {
         return NextResponse.json({ error: "Not enough stock available for this quantity" }, { status: 400 });
      }
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    
    // Populate product details before returning
    await cart.populate("items.productId");

    return NextResponse.json({ message: "Item added to cart", cart }, { status: 200 });
  } catch (error: any) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
