import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import UserProfile from "@/models/UserProfile";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const period = searchParams.get("period") || "allTime"; // daily, weekly, monthly, allTime

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    await dbConnect();

    // 1. Find the creator first
    const profile = await UserProfile.findOne({ username: username.toLowerCase() });
    if (!profile) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    const creatorId = profile.userId;

    // 2. Setup date filter
    const now = new Date();
    let startDate = new Date(0); // For allTime

    if (period === "daily") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === "weekly") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
      startDate = new Date(new Date().setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // 3. Aggregation Pipeline
    const leaderboard = await Transaction.aggregate([
      {
        $match: {
          creatorId,
          status: "COMPLETED",
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$supporter.name",
          totalAmount: { $sum: "$financials.amountNPR" },
          lastTipped: { $max: "$createdAt" }
        }
      },
      {
        $sort: { totalAmount: -1, lastTipped: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          amount: "$totalAmount"
        }
      }
    ]);

    return NextResponse.json({ success: true, leaderboard });
  } catch (error: any) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
