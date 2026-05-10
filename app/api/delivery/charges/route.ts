import { NextResponse } from "next/server";

const DELIVERY_RATES: Record<string, { charges: number; eta: string; label: string }> = {
  home_delivery: { charges: 40, eta: "24–48 hours", label: "Home Delivery" },
  farm_pickup: { charges: 0, eta: "Flexible (your schedule)", label: "Farm Pickup" },
  express_delivery: { charges: 100, eta: "Same day", label: "Express Delivery" },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const method = searchParams.get("method") || "home_delivery";

    const rate = DELIVERY_RATES[method];
    if (!rate) {
      return NextResponse.json({ error: "Invalid delivery method" }, { status: 400 });
    }

    return NextResponse.json({ ...rate, method }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch delivery charges" }, { status: 500 });
  }
}

// Export all rates for reference
export const ALL_RATES = DELIVERY_RATES;
