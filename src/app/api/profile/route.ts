import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import UserProfile from "@/models/UserProfile";

// Helper to sanitize dynamic username strings
function generateUsername(email: string | null) {
  if (!email) return `user_${Math.floor(Math.random() * 10000)}`;
  return email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase() + Math.floor(Math.random() * 100);
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the profile, or create a default one if it doesn't exist
    let profile = await UserProfile.findOne({ userId: session.user.id });

    if (!profile) {
      profile = await UserProfile.create({
        userId: session.user.id,
        username: generateUsername(session.user.email || ""),
        settings: {
          latestSupportersCount: 10,
          minTipAmount: 50,
          maxMessageLength: 99,
          profanityFilterEnabled: false,
          customBadWords: [],
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("GET Profile Error", error);
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

    // 1. If updating username, check for uniqueness
    if (data.username) {
      const sanitizedUsername = data.username.toLowerCase().replace(/[^a-z0-9]/g, "");
      const existing = await UserProfile.findOne({ 
        username: sanitizedUsername,
        userId: { $ne: session.user.id } 
      });

      if (existing) {
        return NextResponse.json({ error: "This Tip Page URL is already taken. Please choose another." }, { status: 400 });
      }
      data.username = sanitizedUsername;
    }

    // 2. Prevent overwriting the userId
    delete data.userId;

    const profile = await UserProfile.findOneAndUpdate(
      { userId: session.user.id },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("POST Profile Error", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
