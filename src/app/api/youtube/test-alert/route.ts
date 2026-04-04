import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { google } from "googleapis";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount = "50", message = "Test tip from Sahayog!" } = await req.json().catch(() => ({}));

    // Connect to database and fetch the account tokens
    const client = await clientPromise;
    const db = client.db();
    
    // The @auth/mongodb-adapter creates 'accounts' collection with references to the userId
    // Note: userId might be cast as an ObjectId in the DB depending on architecture
    const account = await db.collection("accounts").findOne({ 
      userId: new ObjectId(session.user.id),
      provider: "google" 
    });

    if (!account || !account.access_token) {
      return NextResponse.json({ error: "No Google account linked or missing tokens." }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    // Set credentials, including refresh token for longevity
    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // Step 1: Find the user's active live broadcast
    const broadcastResponse = await youtube.liveBroadcasts.list({
      part: ["snippet"],
      broadcastType: "all",
      broadcastStatus: "active",
    });

    const broadcast = broadcastResponse.data.items?.[0];

    if (!broadcast) {
      return NextResponse.json({ error: "No active live stream found. Start streaming to test the alert!" }, { status: 404 });
    }

    const liveChatId = broadcast.snippet?.liveChatId;

    if (!liveChatId) {
      return NextResponse.json({ error: "No live chat associated with the active stream." }, { status: 404 });
    }

    // Step 2: Insert the message into the chat
    await youtube.liveChatMessages.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          liveChatId,
          type: "textMessageEvent",
          textMessageDetails: {
            messageText: `(tipper): Rs. ${amount} cr8.rs/jiggle - Message: ${message}`,
          },
        },
      },
    });

    return NextResponse.json({ success: true, message: "Test alert sent to YouTube chat!" });
  } catch (error: any) {
    console.error("YouTube API Errror:", error);
    return NextResponse.json({ error: error.message || "Failed to send youtube alert" }, { status: 500 });
  }
}
