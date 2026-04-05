"use client";

import { useState, useEffect } from "react";
import { Download, Plus, Loader2, CheckCircle2, History, Wallet, ArrowUpRight, ArrowDownLeft, Building2, Coins, Info, Copy, Settings2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PayoutPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("request");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [stats, setStats] = useState({
    totalEarnings: 0,
    grossEarnings: 0,
    todaysEarnings: 0,
    currentBalance: 0
  });

  const [profile, setProfile] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [recentTips, setRecentTips] = useState<any[]>([]);
  
  // Payout Method Setup State
  const [setupMethod, setSetupMethod] = useState<"KHALTI" | "BANK">("KHALTI");
  const [setupData, setSetupData] = useState({
    accountName: "",
    accountNumber: "",
  });

  // Withdrawal Form State
  const [amount, setAmount] = useState(500);
  const [remarks, setRemarks] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, profileRes, payoutsRes, tipsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/profile"),
        fetch("/api/payouts"),
        fetch("/api/transactions") // Will return user's own tips
      ]);

      const statsData = await statsRes.json();
      const profileData = await profileRes.json();
      const payoutsData = await payoutsRes.json();
      const tipsData = await tipsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (profileData.success) setProfile(profileData.profile);
      if (payoutsData.success) setPayouts(payoutsData.payouts);
      if (tipsData.success) setRecentTips(tipsData.transactions.slice(0, 5));
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
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePayoutMethod = async () => {
    if (!setupData.accountName || !setupData.accountNumber) {
        alert("Please fill all fields.");
        return;
    }
    setIsSubmitting(true);
    try {
        const res = await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                payoutDetails: {
                    method: setupMethod,
                    accountName: setupData.accountName,
                    accountNumber: setupData.accountNumber,
                    isVerified: true
                }
            })
        });
        const data = await res.json();
        if (data.success) {
            alert("Payout method linked successfully!");
            fetchData();
        } else {
            alert(data.error);
        }
    } catch (e) {
        alert("Failed to save payout method.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none mb-1">Financials</h1>
            <p className="text-sm font-medium text-slate-500">Manage your earnings, fees, and bank transfers.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-slate-50 transition-all">
            <Loader2 className={`w-4 h-4 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 text-white rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[200px]">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 mb-2 block">Current Balance</span>
            <h2 className="text-4xl font-black tracking-tight">Rs. {stats.currentBalance.toLocaleString()}</h2>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">Ready for payout</div>
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
        </div>

        <div className="bg-white border border-border rounded-[32px] p-8 flex flex-col justify-between shadow-sm min-h-[200px]">
           <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Total Tips</span>
              <h2 className="text-3xl font-black text-slate-900">Rs. {stats.grossEarnings.toLocaleString()}</h2>
           </div>
           <p className="text-[11px] text-slate-400 font-medium">Full tip volume before platform fee.</p>
        </div>

        <div className="bg-white border border-border rounded-[32px] p-8 flex flex-col justify-between shadow-sm min-h-[200px]">
           <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Net Income</span>
              <h2 className="text-3xl font-black text-emerald-500">Rs. {stats.totalEarnings.toLocaleString()}</h2>
           </div>
           <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> 95% Retention
           </div>
        </div>

        <div className="bg-white border border-border rounded-[32px] p-8 flex flex-col justify-between shadow-sm min-h-[200px]">
           <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Todays Tip</span>
              <h2 className="text-3xl font-black text-slate-900">Rs. {stats.todaysEarnings.toLocaleString()}</h2>
           </div>
           <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full transition-all duration-1000" style={{ width: stats.totalEarnings > 0 ? `${(stats.todaysEarnings / stats.totalEarnings) * 100}%` : '0%' }}></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Request Payout */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           
           {/* Payout Method Setup */}
           <div className="bg-white border border-border rounded-[40px] p-10 shadow-sm overflow-hidden relative">
              {profile?.payoutDetails?.accountNumber ? (
                 <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                       <h3 className="text-lg font-black text-slate-900">Withdrawal Method</h3>
                       <div className="px-4 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Verified</div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                       <div className="flex-1 bg-slate-50 border border-slate-100 rounded-3xl p-6 flex items-center gap-6 group hover:bg-white hover:border-primary/20 transition-all duration-300">
                          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                             {profile.payoutDetails.method === "KHALTI" ? <Coins className="w-8 h-8" /> : <Building2 className="w-8 h-8" />}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{profile.payoutDetails.method}</p>
                             <p className="text-xl font-black text-slate-900">{profile.payoutDetails.accountNumber}</p>
                             <p className="text-sm font-bold text-slate-500 mt-0.5">{profile.payoutDetails.accountName}</p>
                          </div>
                       </div>

                       <div className="w-full sm:w-[320px] p-8 flex flex-col gap-6">
                          <div>
                            <span className="text-sm font-bold text-slate-900">Withdraw Amount</span>
                            <div className="relative mt-3">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">Rs.</span>
                              <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-5 font-black text-2xl focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all"
                              />
                            </div>
                          </div>
                          <button 
                            disabled={isSubmitting || amount > stats.currentBalance || amount < 100}
                            onClick={handlePayoutRequest}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-black py-5 rounded-2xl shadow-[0_15px_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 transition-all disabled:opacity-30 disabled:grayscale"
                          >
                             {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUpRight className="w-5 h-5" />}
                             Transfer to {profile.payoutDetails.method}
                          </button>
                          <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest italic">Min Withdrawal Rs. 100</p>
                       </div>
                    </div>
                 </div>
              ) : (
                <div className="flex flex-col gap-8">
                   <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-black text-slate-900">Setup Payout Method</h3>
                      <p className="text-sm font-medium text-slate-500">Provide your verified Khalti ID or Bank details to start withdrawing your earnings.</p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setSetupMethod("KHALTI")}
                        className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${setupMethod === 'KHALTI' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                      >
                         <Coins className="w-8 h-8" />
                         <span className="text-sm font-black">Khalti ID</span>
                      </button>
                      <button 
                        onClick={() => setSetupMethod("BANK")}
                        className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${setupMethod === 'BANK' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                      >
                         <Building2 className="w-8 h-8" />
                         <span className="text-sm font-black">Bank Account</span>
                      </button>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Holder Name</label>
                        <input 
                           type="text" 
                           placeholder="Full official name"
                           value={setupData.accountName}
                           onChange={(e) => setSetupData({...setupData, accountName: e.target.value})}
                           className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{setupMethod === 'KHALTI' ? 'Khalti Mobile Number' : 'Account/IBAN Number'}</label>
                        <input 
                           type="text" 
                           placeholder={setupMethod === 'KHALTI' ? "98xxxxxxxx" : "Account Number"}
                           value={setupData.accountNumber}
                           onChange={(e) => setSetupData({...setupData, accountNumber: e.target.value})}
                           className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                   </div>

                   <button 
                      onClick={handleSavePayoutMethod}
                      disabled={isSubmitting}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                   >
                     {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-primary" />}
                     Link Verified Method
                   </button>
                </div>
              )}
           </div>

           {/* Recent Earnings / Tips list */}
           <div className="bg-white border border-border rounded-[40px] shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-border bg-slate-50/50 flex items-center justify-between">
                 <h3 className="font-black text-slate-900">Recent Earnings</h3>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <History className="w-3 h-3" /> Updated live
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <tbody>
                       {recentTips.length === 0 ? (
                          <tr><td className="px-8 py-10 text-center text-slate-400 font-medium italic">No transactions yet. Spread your link to start earning!</td></tr>
                       ) : recentTips.map((tip) => (
                          <tr key={tip._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                                      {tip.supporter?.name?.charAt(0) || tip.supporter?.charAt(0) || "S"}
                                   </div>
                                   <div>
                                      <p className="font-black text-slate-900">{tip.supporter?.name || tip.supporter}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(tip.createdAt).toLocaleDateString()}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <p className="text-xs text-slate-500 font-medium italic">"{tip.message || "No message"}"</p>
                             </td>
                             <td className="px-8 py-5 text-right">
                                <p className="font-black text-emerald-500">+ Rs. {tip.financials?.netAmountNPR || tip.amount}</p>
                                <p className="text-[10px] text-slate-400 font-bold">after fee</p>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Right: Payout History */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-white border border-border rounded-[40px] shadow-sm flex flex-col h-full overflow-hidden">
              <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                 <h3 className="font-black text-slate-900">Transfer Log</h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{payouts.length} Requests</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[800px]">
                 {payouts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                       <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-4">
                          <History className="w-8 h-8" />
                       </div>
                       <p className="text-sm font-bold text-slate-400 italic">No transfer logs available.</p>
                    </div>
                 ) : payouts.map((p) => (
                    <div key={p._id} className="bg-slate-50/50 hover:bg-white hover:border-slate-200 border border-transparent rounded-[24px] p-5 transition-all duration-300">
                       <div className="flex items-center justify-between mb-4">
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             p.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' :
                             p.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                             p.status === 'FAILED' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-200 text-slate-500'
                          }`}>
                             {p.status}
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{new Date(p.createdAt).toLocaleDateString()}</p>
                       </div>
                       <div className="flex items-end justify-between">
                          <div>
                             <p className="text-xl font-black text-slate-900">Rs. {p.amountNPR.toLocaleString()}</p>
                             <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{p.payoutMethod}</p>
                          </div>
                          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                             <ArrowDownLeft className="w-4 h-4" />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-8 bg-slate-50/80 border-t border-border mt-auto">
                 <div className="flex items-center gap-3 text-slate-500 mb-1">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Processing Time</span>
                 </div>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">Most Sahayog transfers appear in your account within 2-4 hours, but can take up to 48 hours for Bank Transfer.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
