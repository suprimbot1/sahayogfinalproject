import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import Payout from "@/models/Payout";

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Calculate All Time Earnings (Successful Tips)
    const allTimeAgg = await Transaction.aggregate([
      { $match: { creatorId: userId, status: "COMPLETED" } },
      { $group: { _id: null, total: { $sum: "$financials.netAmountNPR" } } }
    ]);
    const totalEarnings = allTimeAgg.length > 0 ? allTimeAgg[0].total : 0;

    // 2. Calculate Current Balance (Earnings - non-FAILED Payouts)
    const payoutsAgg = await Payout.aggregate([
        { $match: { creatorId: userId, status: { $ne: "FAILED" } } },
        { $group: { _id: null, total: { $sum: "$amountNPR" } } }
    ]);
    const totalWithdrawn = payoutsAgg.length > 0 ? payoutsAgg[0].total : 0;
    const currentBalance = totalEarnings - totalWithdrawn;

    // 3. Calculate Today's Earnings
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayAgg = await Transaction.aggregate([
        { $match: { creatorId: userId, status: "COMPLETED", createdAt: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: "$financials.netAmountNPR" } } }
    ]);
    const todaysEarnings = todayAgg.length > 0 ? todayAgg[0].total : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalEarnings,
        todaysEarnings,
        currentBalance
      }
    });

  } catch (error: any) {
    console.error("GET Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
