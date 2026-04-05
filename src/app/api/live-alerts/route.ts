import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const queryCreatorId = url.searchParams.get("creatorId");
  
  const session = await auth();

  // Prefer session user, but fallback to query param for public overlay use (OBS)
  const userId = session?.user?.id || queryCreatorId;

  if (!userId) {
    return new Response("Unauthorized: No creator identity found", { status: 401 });
  }

  const responseHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
  };

  const stream = new ReadableStream({
    async start(controller) {
      await dbConnect();

      // Setup MongoDB Change Stream to watch the Transaction collection
      // specifically for COMPLETED status changes for this specific user.
      const changeStream = Transaction.watch([
        {
          $match: {
            $or: [
              { "operationType": "insert", "fullDocument.status": "COMPLETED" },
              { "operationType": "update", "updateDescription.updatedFields.status": "COMPLETED" }
            ],
            "fullDocument.creatorId": userId
          }
        }
      ], { fullDocument: "updateLookup" });

      const onData = (change: any) => {
        const doc = change.fullDocument;
        if (doc && doc.creatorId === userId && doc.status === "COMPLETED") {
          const data = JSON.stringify({
            id: doc._id,
            supporter: doc.supporter.name,
            amount: doc.financials.amountNPR,
            message: doc.message,
            timestamp: doc.createdAt
          });
          controller.enqueue(`data: ${data}\n\n`);
        }
      };

      changeStream.on("change", onData);

      // Heartbeat pulse to keep the connection alive
      const intervalId = setInterval(() => {
        controller.enqueue(": heartbeat\n\n");
      }, 30000);

      req.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
        changeStream.close();
        controller.close();
      });
    }
  });

  return new Response(stream, { headers: responseHeaders });
}
