import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import MessageOverlayConfig from "@/models/MessageOverlayConfig";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const session = await auth();
    const url = new URL(req.url);
    const queryUserId = url.searchParams.get("userId");

    const targetUserId = queryUserId || session?.user?.id;

    if (!targetUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let config = await MessageOverlayConfig.findOne({ userId: targetUserId });

    if (!config) {
      config = await MessageOverlayConfig.create({
        userId: targetUserId,
      });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("GET MessageOverlayConfig Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await dbConnect();

    const config = await MessageOverlayConfig.findOneAndUpdate(
      { userId: session.user.id },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error("POST MessageOverlayConfig Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save message overlay config" }, { status: 500 });
  }
}
