import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import UserProfile from "@/models/UserProfile";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // 1. Check if the user is authenticated (Creator asking for their dashboard history)
    const session = await auth();
    
    // 2. Alternatively, check if the request has a ?username= query intended for public tip page
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    let targetUserId = session?.user?.id;

    if (username) {
       const profile = await UserProfile.findOne({ username: username.toLowerCase() });
       if (profile) targetUserId = profile.userId;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "Unauthorized or User Not Found" }, { status: 401 });
    }

    // 3. Construct Query
    const query: any = { creatorId: targetUserId };
    
    // If it's a public request (from /[username]), only show COMPLETED
    if (username) {
        query.status = "COMPLETED";
    }

    const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .limit(100);

    return NextResponse.json({ success: true, transactions });
  } catch (error: any) {
    console.error("GET Transactions Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    const { username, supporterName, email, amount, message } = data;

    if (!username || !supporterName || !amount) {
      return NextResponse.json({ error: "Missing required tip fields" }, { status: 400 });
    }

    const profile = await UserProfile.findOne({ username: username.toLowerCase() });
    
    if (!profile) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // 1. Create a PENDING transaction
    const newTransaction = await Transaction.create({
      creatorId: profile.userId,
      supporter: {
        name: supporterName,
        email: email || "",
      },
      financials: {
        amountNPR: amount,
        platformFeeNPR: amount * 0.05,
        netAmountNPR: amount * 0.95,
      },
      message: message || "",
      status: "PENDING", 
      paymentMethod: "KHALTI"
    });

    // 2. Initialize Khalti API
    // Ensure we have a return URL, assuming localhost for dev environments. 
    // In prod, use process.env.NEXT_PUBLIC_APP_URL
    const host = req.headers.get('host') || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const returnUrl = `${protocol}://${host}/api/khalti/callback`;
    
    // Fallback secret for preventing crashes if .env is not yet set
    const khaltiSecret = process.env.KHALTI_SECRET_KEY || "test_secret_key_xxxx";

    const khaltiPayload = {
        return_url: returnUrl,
        website_url: `${protocol}://${host}`,
        amount: amount * 100, // Khalti requires amount in Paisa (Rs * 100)
        purchase_order_id: newTransaction._id.toString(),
        purchase_order_name: `Tip for ${profile.username}`,
        customer_info: {
            name: supporterName,
            email: email || "supporter@example.com",
            phone: "9800000000",
        }
    };

    const khaltiResponse = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
        method: "POST",
        headers: {
            "Authorization": `Key ${khaltiSecret}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(khaltiPayload)
    });

    const khaltiData = await khaltiResponse.json();

    if (!khaltiResponse.ok) {
        console.error("Khalti Error Response:", khaltiData);
        // Clean up pending transaction
        await Transaction.findByIdAndDelete(newTransaction._id);
        return NextResponse.json({ error: "Failed to initiate payment gateway", details: khaltiData }, { status: 502 });
    }

    // Save the pidx to our database for future reference
    newTransaction.referenceId = khaltiData.pidx;
    await newTransaction.save();

    // 3. Send the secure payment URL back to the frontend so it can redirect the user
    return NextResponse.json({ 
        success: true, 
        payment_url: khaltiData.payment_url,
        pidx: khaltiData.pidx
    });
  } catch (error: any) {
    console.error("POST Transaction Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process tip" }, { status: 500 });
  }
}
