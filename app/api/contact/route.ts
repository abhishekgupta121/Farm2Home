import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Contact from "@/lib/models/Contact";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const { fullName, phoneNumber, message } = body;

    if (!fullName || !phoneNumber || !message) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    const newContact = await Contact.create({
      fullName,
      phoneNumber,
      message,
    });

    return NextResponse.json(
      { message: "Message sent successfully", contact: newContact },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
