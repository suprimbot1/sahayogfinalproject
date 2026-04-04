import { google } from "googleapis";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function triggerYouTubeChatAlert(creatorId: string, supporterName: string, amount: number, message: string) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // 1. Fetch Google Account tokens from NextAuth 'accounts' collection
    const account = await db.collection("accounts").findOne({
      userId: new ObjectId(creatorId),
      provider: "google",
    });

    if (!account || !account.access_token) {
      console.warn(`[YouTube Alert] No Google account for creator ${creatorId}`);
      return;
    }

    // 2. Setup OAuth2 Client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // 3. Find active live broadcast
    const broadcastResponse = await youtube.liveBroadcasts.list({
      part: ["snippet"],
      broadcastType: "all",
      broadcastStatus: "active",
    });

    const broadcast = broadcastResponse.data.items?.[0];
    const liveChatId = broadcast?.snippet?.liveChatId;

    if (!liveChatId) {
      console.log(`[YouTube Alert] No active live stream found for creator ${creatorId}`);
      return;
    }

    // 4. Send Message to Chat
    // Format: 🎉 {Tipper} tipped Rs. {Amount}! "{Message}" cr8.rs/jiggle
    const alertText = `🎉 ${supporterName} tipped Rs. ${amount}! "${message || "No message"}" - sah-ayog.app`;

    await youtube.liveChatMessages.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          liveChatId,
          type: "textMessageEvent",
          textMessageDetails: {
            messageText: alertText,
          },
        },
      },
    });

    console.log(`[YouTube Alert] Successfully sent alert to chat for ${creatorId}`);
  } catch (error: any) {
    console.error("[YouTube Alert Error]", error.message);
  }
}
