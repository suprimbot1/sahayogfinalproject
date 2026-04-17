"use client";

import { toggleUserStatus, updatePayoutStatus } from "@/app/(admin)/admin/actions";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export function ToggleUserButton({ userId, isActive }: { userId: string, isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(async () => { await toggleUserStatus(userId, isActive); })}
      disabled={isPending}
      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center min-w-[70px] ${
        isActive 
         ? "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white" 
         : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white"
      }`}
    >
      {isPending ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : (isActive ? "Suspend" : "Unban")}
    </button>
  );
}

export function PayoutActionButtons({ payoutId }: { payoutId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={() => startTransition(async () => { await updatePayoutStatus(payoutId, "SUCCESS"); })}
        disabled={isPending}
        className="text-xs font-bold bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
      >
        Approve
      </button>
      <button 
        onClick={() => startTransition(async () => { await updatePayoutStatus(payoutId, "FAILED"); })}
        disabled={isPending}
        className="text-xs font-bold bg-muted text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
