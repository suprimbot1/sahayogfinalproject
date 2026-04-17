import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Delete the account entry to force a clean slate on next login
    await db.collection("accounts").deleteOne({ 
      userId: new ObjectId(session.user.id),
      provider: "google" 
    }) || await db.collection("accounts").deleteOne({ 
        userId: session.user.id,
        provider: "google" 
      });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Reset Account API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
