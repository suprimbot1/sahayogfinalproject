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
    
    console.log("YouTube API: Searching for account for userId:", session.user.id);

    const account = await db.collection("accounts").findOne({ 
      userId: new ObjectId(session.user.id),
      provider: "google" 
    }) || await db.collection("accounts").findOne({ 
      userId: session.user.id,
      provider: "google" 
    });

    if (!account) {
      console.error("YouTube API: Account document NOT FOUND in MongoDB for userId:", session.user.id);
      return NextResponse.json({ 
        success: false, 
        error: "reauth_required", 
        message: "No Google account connection found in our database. Please log out and back in." 
      }, { status: 401 });
    }

    if (!account.access_token) {
       console.error("YouTube API: Account document found but MISSING access_token.");
       return NextResponse.json({ 
         success: false, 
         error: "reauth_required", 
         message: "Your connection is missing security tokens. Please log out and back in." 
       }, { status: 401 });
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

    try {
      // Fetch the channel info for the current user
      const response = await youtube.channels.list({
        part: ["snippet", "statistics"],
        mine: true
      });

      const channel = response.data.items?.[0];

      if (!channel) {
        console.error("YouTube API: No YouTube channel found for this Google account.");
        return NextResponse.json({ 
          success: false, 
          error: "no_channel", 
          message: "We couldn't find a YouTube channel linked to this Google account." 
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        title: channel.snippet?.title || "My YouTube Channel",
        description: channel.snippet?.description,
        thumbnail: channel.snippet?.thumbnails?.medium?.url || channel.snippet?.thumbnails?.default?.url,
        subscriberCount: channel.statistics?.subscriberCount,
      });

    } catch (apiError: any) {
      console.error("YouTube API: Internal Call Error:", apiError.response?.data || apiError.message);
      
      // Check for specific "invalid_grant" or "insufficient permissions"
      if (apiError.message?.includes("invalid_grant") || apiError.code === 401) {
        return NextResponse.json({ 
          success: false, 
          error: "reauth_required",
          message: apiError.message || "Your YouTube session has expired. Please log out and back in." 
        }, { status: 401 });
      }

      return NextResponse.json({ 
        success: false, 
        error: "api_error",
        message: apiError.message || "Google API Error"
      }, { status: 400 });
    }

  } catch (error: any) {
    console.error("YouTube API Route Crash:", error.message);
    return NextResponse.json({ 
      success: false,
      error: error.message || "Failed to fetch youtube channel" 
    }, { status: 500 });
  }
}
