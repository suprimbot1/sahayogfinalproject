import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Payout from "@/models/Payout";
import UserProfile from "@/models/UserProfile";
import Transaction from "@/models/Transaction";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const payouts = await Payout.find({ creatorId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, payouts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, remarks } = await req.json();
    const userId = session.user.id;

    await dbConnect();

    // 1. Validate Balance
    // Sum all COMPLETED transactions
    const totalTransactions = await Transaction.aggregate([
      { $match: { creatorId: userId, status: "COMPLETED" } },
      { $group: { _id: null, total: { $sum: "$financials.netAmountNPR" } } }
    ]);
    const earnings = totalTransactions[0]?.total || 0;

    // Sum all non-FAILED payouts
    const totalPayouts = await Payout.aggregate([
      { $match: { creatorId: userId, status: { $ne: "FAILED" } } },
      { $group: { _id: null, total: { $sum: "$amountNPR" } } }
    ]);
    const withdrawn = totalPayouts[0]?.total || 0;

    const availableBalance = earnings - withdrawn;

    if (amount > availableBalance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    if (amount < 100) {
      return NextResponse.json({ error: "Minimum payout is Rs. 100" }, { status: 400 });
    }

    // 2. Get User Payout Details
    const profile = await UserProfile.findOne({ userId });
    if (!profile?.payoutDetails?.accountNumber) {
      return NextResponse.json({ error: "Please configure your payout account first" }, { status: 400 });
    }

    // 3. Create Payout Request
    const payout = await Payout.create({
      creatorId: userId,
      amountNPR: amount,
      status: "PENDING",
      payoutMethod: profile.payoutDetails.method,
      accountDetails: {
        name: profile.payoutDetails.accountName,
        number: profile.payoutDetails.accountNumber
      },
      remarks: remarks || ""
    });

    return NextResponse.json({ success: true, payout });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
