import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import { LineChart, Wallet } from "lucide-react";

export default async function AdminRevenuePage() {
  await dbConnect();

  // Fetch all completed transactions globally, sorted by newest
  const transactions = await Transaction.find({ status: "COMPLETED" })
    .sort({ createdAt: -1 })
    .lean();

  // Aggregate total platform revenue
  const totalPlatformRevenue = transactions.reduce(
    (sum, tx: any) => sum + (tx.financials?.platformFeeNPR || 0),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Revenue Log</h1>
        <p className="text-sm text-muted-foreground">Track total platform commissions extracted across all tips.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Total Sahayog Revenue</CardTitle>
            <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-500">
               Rs. {totalPlatformRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs font-semibold text-emerald-700/60 dark:text-emerald-400/60 mt-1 uppercase tracking-wider">All-Time Platform Fees Collected</p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Transactions</CardTitle>
            <LineChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">
               {transactions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total tips successfully brokered</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Commission Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
             <div className="text-sm text-muted-foreground py-10 text-center bg-muted/5 rounded-xl border border-border">
               No transactions logged yet. Let's get tipping!
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg font-bold">Transaction ID</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Supporter</th>
                    <th className="px-4 py-3 font-bold text-right">Gross Amount</th>
                    <th className="px-4 py-3 rounded-tr-lg font-bold text-right text-emerald-600 dark:text-emerald-400">Platform Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: any) => (
                    <tr key={tx._id.toString()} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">
                        {tx.referenceId || tx._id.toString().substring(0, 10) + "..."}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-bold text-foreground">
                        {tx.supporter?.name || "Anonymous"}
                      </td>
                      <td className="px-4 py-3 font-bold text-right">
                         Rs. {tx.financials.amountNPR}
                      </td>
                      <td className="px-4 py-3 text-right font-black text-emerald-600 dark:text-emerald-500">
                         + Rs. {tx.financials.platformFeeNPR || 0}
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
