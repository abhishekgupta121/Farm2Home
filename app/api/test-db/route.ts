import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "DB Connected successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "DB Connection failed" }, { status: 500 });
  }
}
