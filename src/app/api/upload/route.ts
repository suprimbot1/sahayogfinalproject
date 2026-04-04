import { NextResponse } from "next/server";
import { auth } from "@/auth";
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

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    const filepath = path.join(uploadsDir, filename);

    // Write file directly to public directory
    await fs.writeFile(filepath, buffer);

    // Return the relative URL which Next.js serves publicly
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
