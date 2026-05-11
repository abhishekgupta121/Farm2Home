import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/Cart";
import Crop from "@/lib/models/Crop"; // required for populate to know the Crop schema
import { getUserIdFromAuth } from "../../route";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const userId = getUserIdFromAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const productId = resolvedParams.id;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item: any) => {
      // Handle both populated and unpopulated productId
      const currentId = item.productId._id ? item.productId._id.toString() : item.productId.toString();
      return currentId !== productId;
    });

    if (cart.items.length === initialLength) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    await cart.save();
    await cart.populate("items.productId");

    return NextResponse.json({ message: "Item removed from cart", cart }, { status: 200 });
  } catch (error: any) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
