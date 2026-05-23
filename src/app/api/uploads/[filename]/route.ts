import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Upload from "@/models/Upload";

export async function GET(
  req: Request,
  props: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await props.params;
    await dbConnect();
    
    const fileDoc = await Upload.findOne({ filename });
    if (!fileDoc) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    // Set dynamic Cache-Control for fast CDN serving on Vercel
    return new Response(fileDoc.data, {
      headers: {
        "Content-Type": fileDoc.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Fetch File Error:", error);
    return NextResponse.json({ error: "Failed to retrieve file." }, { status: 500 });
  }
}
