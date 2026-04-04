import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import AlertConfig from "@/models/AlertConfig";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // 1. Check if authenticated
    const session = await auth();
    
    // Check if it's a public request from overlay (e.g. ?userId=...)
    const url = new URL(req.url);
    const queryUserId = url.searchParams.get("userId");

    const targetUserId = queryUserId || session?.user?.id;

    if (!targetUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch or create default config
    let config = await AlertConfig.findOne({ userId: targetUserId });

    if (!config) {
      config = await AlertConfig.create({
        userId: targetUserId,
      });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("GET AlertConfig Error:", error);
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

    // Find and update or create alert config
    const config = await AlertConfig.findOneAndUpdate(
      { userId: session.user.id },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error("POST AlertConfig Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save alert config" }, { status: 500 });
  }
}
