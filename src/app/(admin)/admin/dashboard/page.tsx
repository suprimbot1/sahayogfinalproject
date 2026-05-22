import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Activity, TrendingUp } from "lucide-react";
import dbConnect from "@/lib/mongoose";
import UserProfile from "@/models/UserProfile";
import Transaction from "@/models/Transaction";
import Payout from "@/models/Payout";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  await dbConnect();

  // Basic Platform Stats
  const totalCreators = await UserProfile.countDocuments({ role: "CREATOR" });
  
  const allTips = await Transaction.find({ status: "COMPLETED" });
  const totalVolumeNPR = allTips.reduce((sum, tip) => sum + tip.financials.amountNPR, 0);

  const pendingPayouts = await Payout.countDocuments({ status: "PENDING" });

  // Live feeds
  const recentCreators = await UserProfile.find({ role: "CREATOR" }).sort({ createdAt: -1 }).limit(5).lean();
  const recentTransactions = await Transaction.find({ status: "COMPLETED" }).sort({ createdAt: -1 }).limit(5).lean();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Global Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor the health and stats of the Sahayog platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Volume */}
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tip Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">NPR {totalVolumeNPR.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Platform lifetime</p>
          </CardContent>
        </Card>

        {/* Total Creators */}
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalCreators}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>

        {/* Pending Payout Requests */}
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-orange-500">{pendingPayouts}</div>
            <p className="text-xs text-muted-foreground mt-1">Requiring action</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feeds */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card shadow-sm border-border flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Recent Platform Signups</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
             {recentCreators.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-70">
                  <Users className="w-10 h-10 mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">No users found.</p>
                </div>
             ) : (
                recentCreators.map((creator: any) => (
                  <div key={creator._id.toString()} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs uppercase">
                        {creator.username.slice(0, 2)}
                      </div>
                      <div className="flex flex-col text-sm">
                         <span className="font-bold text-foreground">@{creator.username}</span>
                         <span className="text-xs text-muted-foreground">{new Date(creator.createdAt!).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
             )}
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Live Transactions</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
             {recentTransactions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-70">
                  <TrendingUp className="w-10 h-10 mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">No transactions found.</p>
                </div>
             ) : (
                recentTransactions.map((tx: any) => (
                  <div key={tx._id.toString()} className="flex justify-between items-center border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div className="flex flex-col text-sm">
                      <span className="font-bold text-foreground">{tx.supporter?.name || "Anonymous"} tipping ...</span>
                      <span className="text-xs text-muted-foreground">{new Date(tx.createdAt!).toLocaleTimeString()}</span>
                    </div>
                    <span className="font-black text-primary">Rs. {tx.financials.amountNPR}</span>
                  </div>
                ))
             )}
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
