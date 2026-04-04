"use client";

import { useState, useEffect } from "react";
import { Download, Plus, Loader2, CheckCircle2, History } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PayoutPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("request");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [stats, setStats] = useState({
    totalEarnings: 0,
    todaysEarnings: 0,
    currentBalance: 0
  });

  const [profile, setProfile] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  
  // Form State
  const [amount, setAmount] = useState(500);
  const [remarks, setRemarks] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, profileRes, payoutsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/profile"),
        fetch("/api/payouts")
      ]);

      const statsData = await statsRes.json();
      const profileData = await profileRes.json();
      const payoutsData = await payoutsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (profileData.success) setProfile(profileData.profile);
      if (payoutsData.success) setPayouts(payoutsData.payouts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePayoutRequest = async () => {
    if (amount > stats.currentBalance) {
      alert("Insufficient balance!");
      return;
    }
    if (amount < 100) {
      alert("Minimum payout is Rs. 100");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, remarks })
      });
      const data = await res.json();
      if (data.success) {
        alert("Payout request submitted successfully!");
        setAmount(500);
        setRemarks("");
        fetchData(); // Refresh stats and history
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Header Info */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Payouts</h1>
        <p className="text-sm text-muted-foreground">
          Manage your payout details and view your payout history.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-border/50">
        <button
          onClick={() => setActiveTab("request")}
          className={`pb-3 text-sm font-semibold relative transition-colors ${
            activeTab === "request" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Payout Request
          {activeTab === "request" && (
            <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-semibold relative transition-colors ${
            activeTab === "history" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Payout History
          {activeTab === "history" && (
            <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary"></div>
          )}
        </button>
      </div>

      {activeTab === "request" && (
        <div className="flex flex-col gap-8">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm relative overflow-hidden">
               <div className="relative z-10">
                <div className="text-sm font-medium opacity-80 mb-1">
                  Available Balance
                </div>
                <h2 className="text-3xl font-black tracking-tight">
                  Rs. {stats.currentBalance.toLocaleString()}
                </h2>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Total Earnings
                </div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">
                  Rs. {stats.totalEarnings.toLocaleString()}
                </h2>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Processing Payouts
                </div>
                <h2 className="text-3xl font-bold text-amber-500 tracking-tight">
                  Rs. {payouts.filter(p => p.status === "PENDING" || p.status === "PROCESSING").reduce((acc, p) => acc + p.amountNPR, 0).toLocaleString()}
                </h2>
              </div>
            </div>
          </div>

          {/* Payout Method */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-foreground">Verified Payout Method</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              {profile?.payoutDetails?.accountNumber ? (
                <div className="border-2 border-primary bg-primary/5 rounded-2xl p-6 relative w-full sm:w-[400px]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xs">
                      {profile.payoutDetails.method}
                    </div>
                    <div>
                        <p className="text-sm font-extrabold text-foreground">{profile.payoutDetails.method === "KHALTI" ? "Khalti ID" : "Bank Account"}</p>
                        <p className="text-xs text-primary font-bold">Verified for withdrawal</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">A/C Name</span>
                        <span className="text-sm font-bold">{profile.payoutDetails.accountName}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">A/C Number</span>
                        <span className="text-sm font-bold">{profile.payoutDetails.accountNumber}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center w-full sm:w-[400px] text-center gap-2">
                   <p className="text-sm font-bold">No Payout Method Linked</p>
                   <p className="text-xs text-muted-foreground">Go to settings to verify your account</p>
                </div>
              )}
            </div>
          </div>

          {/* Request Form */}
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-6 shadow-sm max-w-2xl">
             <h3 className="font-bold">Withdraw Funds</h3>
             <div className="flex flex-col gap-3">
               <label className="text-sm font-bold text-foreground">Amount (NPR)</label>
               <input 
                 type="number" 
                 value={amount}
                 onChange={(e) => setAmount(Number(e.target.value))}
                 className="w-full bg-background border border-border rounded-xl p-4 text-lg font-black focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all" 
               />
               <p className="text-xs text-muted-foreground font-medium italic">Available: Rs. {stats.currentBalance.toLocaleString()}</p>
             </div>
             <div className="flex flex-col gap-3">
               <label className="text-sm font-bold text-foreground">Remarks (Optional)</label>
               <textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Weekly withdrawal" 
                  className="w-full bg-background border border-border rounded-xl p-4 text-sm font-medium min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
               ></textarea>
             </div>
             <button 
                onClick={handlePayoutRequest}
                disabled={isSubmitting || !profile?.payoutDetails?.accountNumber}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-black py-4 rounded-full shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
             >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Withdrawal"}
             </button>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 border-b border-border text-foreground">
                  <tr>
                    <th className="px-6 py-5 font-black text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                    <th className="px-6 py-5 font-black text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-6 py-5 font-black text-xs uppercase tracking-widest text-muted-foreground">Method</th>
                    <th className="px-6 py-5 font-black text-xs uppercase tracking-widest text-muted-foreground">Amount</th>
                    <th className="px-6 py-5 font-black text-xs uppercase tracking-widest text-muted-foreground">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {payouts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground italic">No payout history found.</td>
                    </tr>
                  ) : payouts.map((p, i) => (
                    <tr key={p._id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          p.status === "SUCCESS" ? "bg-emerald-100 text-emerald-600" : 
                          p.status === "PENDING" ? "bg-amber-100 text-amber-600" :
                          p.status === "FAILED" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground/80">{p.payoutMethod}</td>
                      <td className="px-6 py-4 font-black">Rs. {p.amountNPR.toLocaleString()}</td>
                      <td className="px-6 py-4 text-muted-foreground italic text-xs">{p.remarks || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
