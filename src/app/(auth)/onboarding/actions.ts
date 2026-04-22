"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import UserProfile from "@/models/UserProfile";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function checkUsernameAvailability(username: string) {
  if (!username || username.length < 3) return { available: false, error: "Username too short" };
  
  const sanitized = username.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  try {
    await dbConnect();
    const existing = await UserProfile.findOne({ username: sanitized });
    return { available: !existing };
  } catch (error) {
    return { available: false, error: "Database error" };
  }
}

export async function createInitialProfile(data: { username: string }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const sanitizedUsername = data.username.toLowerCase().replace(/[^a-z0-9]/g, "");

  try {
    await dbConnect();
    
    // Final uniqueness check
    const existing = await UserProfile.findOne({ username: sanitizedUsername });
    if (existing) {
      return { success: false, error: "Username already taken" };
    }

    await UserProfile.create({
      userId: session.user.id,
      username: sanitizedUsername,
      role: "CREATOR",
      isActive: true,
      settings: {
        latestSupportersCount: 10,
        minTipAmount: 50,
        maxMessageLength: 99,
        profanityFilterEnabled: false,
        customBadWords: [],
      },
      payoutDetails: {
        method: "KHALTI",
        accountName: "",
        accountNumber: "",
        isVerified: false,
      }
    });

    revalidatePath("/dashboard");
    // We'll redirect from the client side for better UX
    return { success: true };
  } catch (error: any) {
    console.error("Profile creation error:", error);
    return { success: false, error: error.message || "Failed to create profile" };
  }
}
