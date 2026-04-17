"use server";

import dbConnect from "@/lib/mongoose";
import UserProfile from "@/models/UserProfile";
import Payout from "@/models/Payout";
import { revalidatePath } from "next/cache";

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
  try {
    await dbConnect();
    await UserProfile.findByIdAndUpdate(userId, { isActive: !currentStatus });
    revalidatePath("/admin/creators");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle user status:", error);
    return { success: false, error: "Database update failed" };
  }
}

export async function updatePayoutStatus(payoutId: string, status: "SUCCESS" | "FAILED") {
  try {
    await dbConnect();
    await Payout.findByIdAndUpdate(payoutId, {
       status,
       processedAt: new Date(),
    });
    revalidatePath("/admin/payouts");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update payout status:", error);
    return { success: false, error: "Database update failed" };
  }
}
