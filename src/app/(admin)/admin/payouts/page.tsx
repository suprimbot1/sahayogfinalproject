import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/mongoose";
import Payout from "@/models/Payout";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { PayoutActionButtons } from "@/components/admin/ActionButtons";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  await dbConnect();

  // Fetch payouts sorted by newest first
  const payoutsRaw = await Payout.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  // Attach usernames by looking up creatorId
  const payouts = await Promise.all(
    payoutsRaw.map(async (p) => {
      const profile = await dbConnect().then(() => 
        // @ts-ignore - resolve dependency loop if any
        import("@/models/UserProfile").then((m) => m.default.findOne({ userId: p.creatorId }).lean())
      );
      return {
        ...p,
        // @ts-ignore
        username: profile?.username || p.creatorId,
      };
    })
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Global Payout Requests</h1>
        <p className="text-sm text-muted-foreground">Manage and process payout requests from creators.</p>
      </div>

      <Card className="bg-card shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Payout Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
             <div className="text-sm text-muted-foreground py-8 text-center bg-muted/5 rounded-xl border border-border">
               No payouts requested yet.
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg font-bold">Creator</th>
                    <th className="px-4 py-3 font-bold">Amount</th>
                    <th className="px-4 py-3 font-bold">Method & Details</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 rounded-tr-lg font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout: any) => (
                    <tr key={payout._id.toString()} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 font-bold text-foreground">
                        @{payout.username}
                      </td>
                      <td className="px-4 py-3 font-black text-primary">
                        Rs. {payout.amountNPR}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                           <span className="font-bold">{payout.payoutMethod}</span>
                           <span className="text-xs text-muted-foreground">{payout.accountDetails?.number || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase ${
                          payout.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                          payout.status === "PENDING" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" :
                          "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}>
                          {payout.status === "SUCCESS" ? <CheckCircle className="w-3 h-3" /> :
                           payout.status === "PENDING" ? <Clock className="w-3 h-3" /> :
                           <XCircle className="w-3 h-3" />}
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {payout.status === "PENDING" ? (
                           <PayoutActionButtons payoutId={payout._id.toString()} />
                        ) : (
                           <span className="text-xs text-muted-foreground font-medium italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
