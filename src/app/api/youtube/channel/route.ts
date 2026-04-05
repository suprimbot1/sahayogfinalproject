import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { google } from "googleapis";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database and fetch the account tokens
    const client = await clientPromise;
    const db = client.db();
    
    const account = await db.collection("accounts").findOne({ 
      userId: new ObjectId(session.user.id),
      provider: "google" 
    });

    if (!account || !account.access_token) {
      return NextResponse.json({ error: "No Google account linked." }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // Fetch the channel info for the current user
    const response = await youtube.channels.list({
      part: ["snippet", "statistics"],
      mine: true
    });

    const channel = response.data.items?.[0];

    if (!channel) {
      return NextResponse.json({ error: "No YouTube Channel found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      title: channel.snippet?.title || "My YouTube Channel",
      description: channel.snippet?.description,
      thumbnail: channel.snippet?.thumbnails?.medium?.url || channel.snippet?.thumbnails?.default?.url,
      subscriberCount: channel.statistics?.subscriberCount,
    });

  } catch (error: any) {
    console.error("YouTube Channel API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch youtube channel" }, { status: 500 });
  }
}
