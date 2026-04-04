import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import UserProfile from "@/models/UserProfile";
import { triggerYouTubeChatAlert } from "@/lib/youtube";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pidx = url.searchParams.get("pidx");
    const transactionId = url.searchParams.get("purchase_order_id");
    const status = url.searchParams.get("status");

    // Basic Khalti webhook data check
    if (!pidx || !transactionId) {
      return NextResponse.redirect(new URL("/?error=missing_khalti_data", req.url));
    }

    await dbConnect();
    
    // Find the pending transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.redirect(new URL("/?error=transaction_not_found", req.url));
    }

    // Find the creator profile to build the return URL later
    const profile = await UserProfile.findOne({ userId: transaction.creatorId });
    const username = profile?.username || "";

    // 1. If user literally cancelled the Khalti checkout
    if (status !== "Completed") {
       transaction.status = "FAILED";
       await transaction.save();
       return NextResponse.redirect(new URL(`/${username}?payment=cancelled`, req.url));
    }

    // 2. Perform extreme security lookup to VERIFY the Khalti transaction (Server-Side)
    const khaltiSecret = process.env.KHALTI_SECRET_KEY || "test_secret_key_xxxx";
    
    const lookupResponse = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
        method: "POST",
        headers: {
            "Authorization": `Key ${khaltiSecret}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pidx })
    });

    const lookupData = await lookupResponse.json();

    // 3. Verify Khalti says it's officially Completed
    if (lookupResponse.ok && lookupData.status === "Completed") {
        transaction.status = "COMPLETED";
        
        // Save the transaction reference ID sent from khalti just for record keeping
        transaction.referenceId = lookupData.transaction_id || pidx; 
        await transaction.save();
        
        // 4. Trigger YouTube Chat Alert
        // We do this asynchronously so we don't delay the user redirect
        triggerYouTubeChatAlert(
            transaction.creatorId, 
            transaction.supporter.name, 
            transaction.financials.amountNPR, 
            transaction.message
        ).catch(err => console.error("YouTube Alert Trigger Failure:", err));
        
        // Successfully bounded. Later this is where you can trigger WebSockets to the overlay!
        return NextResponse.redirect(new URL(`/${username}?payment=success`, req.url));
    } else {
        // Khalti lookup failed or indicates it was spoofed/fake
        transaction.status = "FAILED";
        await transaction.save();
        return NextResponse.redirect(new URL(`/${username}?payment=failed`, req.url));
    }

  } catch (error) {
    console.error("Khalti Webhook Error:", error);
    return NextResponse.redirect(new URL("/?error=internal_server_error", req.url));
  }
}
