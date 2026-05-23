import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Upload from "@/models/Upload";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename to prevent clashes
    const ext = path.extname(file.name) || ".png";
    const filename = `${session.user.id}_${Date.now()}${ext}`;

    // 1. Store raw binary data in MongoDB
    await dbConnect();
    await Upload.create({
      filename,
      contentType: file.type || "application/octet-stream",
      data: buffer,
      size: file.size,
    });

    // 2. Safely attempt local filesystem write (non-blocking fallback for localhost cache)
    try {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filepath = path.join(uploadsDir, filename);
      await fs.writeFile(filepath, buffer);
    } catch (fsErr) {
      console.warn("FS write bypassed (read-only environment like Vercel):", fsErr);
    }

    // Return the relative URL served by our dynamic route
    const fileUrl = `/api/uploads/${filename}`;
    
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}

