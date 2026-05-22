"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Loader2, 
  CheckCircle, 
  History, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2, 
  Info,
  CreditCard,
  ChevronDown,
  X,
  Settings2
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/toast";

export default function PayoutPage() {
  const { data: session } = useSession();
  const formRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("request"); // request | history
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error, warning } = useToast();
  
  // Payout Stats
  const [stats, setStats] = useState({
    currentBalance: 0,
    grossEarnings: 0,
    totalEarnings: 0
  });

  // User Profile and Payout List
  const [profile, setProfile] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);

  // Payout Method Setup State
  const [isSettingUp, setIsSettingUp] = useState(false);
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
      const [statsRes, profileRes, payoutsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/profile"),
        fetch("/api/payouts")
      ]);

      const statsData = await statsRes.json();
      const profileData = await profileRes.json();
      const payoutsData = await payoutsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (profileData && !profileData.error) setProfile(profileData);
      else if (profileData.profile) setProfile(profileData.profile); // Fallback if format changed
      
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
      warning("Insufficient balance!", "Balance Error");
      return;
    }
    if (amount < 100) {
      warning("Minimum payout is Rs. 100", "Amount Low");
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
        success("Payout request submitted successfully! 🍹");
        setAmount(100);
        setRemarks("");
        fetchData(); // Refresh all balances and history
      } else {
        error(data.error || "Something went wrong");
      }
    } catch (e) {
      error("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePayoutMethod = async () => {
    if (!setupData.accountName || !setupData.accountNumber) {
        warning("Please fill all fields.");
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
            success("Payout method linked successfully! ✨");
            setIsSettingUp(false);
            fetchData();
        } else {
            error(data.error || "Failed to link method");
        }
    } catch (e) {
        error("Failed to save payout method.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#008d4a]" /></div>;

  // Processing balance = Sum of PENDING payouts
  const processingBalance = payouts
    .filter(p => p.status === "PENDING")
    .reduce((acc, current) => acc + (current.amountNPR || 0), 0);

  return (
    <div className="flex flex-col gap-10 max-w-[1400px] mx-auto p-4 md:p-10 bg-background min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-black text-foreground tracking-tight">Payouts</h1>
         <p className="text-sm font-medium text-muted-foreground">Manage your payout details and view your payout history.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-10 border-b border-border mb-2">
         <button 
           onClick={() => setActiveTab("request")}
           className={`pb-4 text-sm font-black transition-all relative ${
             activeTab === "request" ? "text-primary" : "text-muted-foreground"
           }`}
         >
           Payout Request
           {activeTab === "request" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full"></div>}
         </button>
         <button 
           onClick={() => setActiveTab("history")}
           className={`pb-4 text-sm font-black transition-all relative ${
             activeTab === "history" ? "text-primary" : "text-muted-foreground"
           }`}
         >
           Payout History
           {activeTab === "history" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full"></div>}
         </button>
      </div>

      {activeTab === "request" ? (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-top-2 duration-500">
           
           {/* 3 Balanced Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#f2f0ff] dark:bg-card rounded-[24px] p-8 border border-[#e5e1ff] dark:border-border flex flex-col justify-between min-h-[180px]">
                 <div>
                    <span className="text-[12px] font-black uppercase text-indigo-400 tracking-widest mb-1 block">Available Balance</span>
                    <h2 className="text-3xl font-black text-foreground tracking-tight leading-none">NPR {stats.currentBalance.toLocaleString('en-NP', { minimumFractionDigits: 2 })}</h2>
                 </div>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Total Balance for withdraw</p>
              </div>

              <div className="bg-[#fefce8] dark:bg-card rounded-[24px] p-8 border border-[#fef9c3] dark:border-border flex flex-col justify-between min-h-[180px]">
                 <div>
                    <span className="text-[12px] font-black uppercase text-yellow-500 tracking-widest mb-1 block">Payout Processing</span>
                    <h2 className="text-3xl font-black text-foreground tracking-tight leading-none">NPR {processingBalance.toLocaleString('en-NP', { minimumFractionDigits: 2 })}</h2>
                 </div>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Balanced on hold for payout requests</p>
              </div>

              <div className="bg-[#fff1f2] dark:bg-card rounded-[24px] p-8 border border-[#ffe4e6] dark:border-border flex flex-col justify-between min-h-[180px]">
                 <div>
                    <span className="text-[12px] font-black uppercase text-rose-400 tracking-widest mb-1 block">Card hold balance</span>
                    <h2 className="text-3xl font-black text-foreground tracking-tight leading-none">NPR 0.00</h2>
                 </div>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Balanced on hold for VISA / Mastercard</p>
              </div>
           </div>

           {/* Payout Method Section */}
           <div className="flex flex-col gap-6">
              <h3 className="text-sm font-black text-foreground tracking-tight">Payout Method</h3>
              <div className="flex flex-col lg:flex-row gap-6">
                 
                 {/* Existing Method Card */}
                 {profile?.payoutDetails?.accountNumber ? (
                    <div className="flex-1 bg-muted/20 border-2 border-primary rounded-[28px] p-8 flex flex-col gap-6 relative group transition-all shadow-sm">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-card border border-border shadow-sm font-black text-primary text-xs flex items-center justify-center">Sah.</div>
                             <span className="font-black text-foreground text-lg">Khalti</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black text-primary bg-background px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">Verified</span>
                             <button 
                               onClick={() => {
                                  setSetupMethod(profile.payoutDetails.method || "KHALTI");
                                  setSetupData({
                                     accountName: profile.payoutDetails.accountName,
                                     accountNumber: profile.payoutDetails.accountNumber
                                  });
                                  setIsSettingUp(true);
                                  setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                               }}
                               className="p-1.5 hover:bg-background rounded-lg text-muted-foreground hover:text-primary transition-all"
                             >
                                <Settings2 className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                       <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-0.5">
                             <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">Account Name</span>
                             <p className="font-black text-foreground text-md tracking-tight">{profile.payoutDetails.accountName}</p>
                          </div>
                          <div className="flex flex-col gap-0.5 mt-2">
                             <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">Account Number</span>
                             <p className="font-black text-foreground text-md tracking-tight">{profile.payoutDetails.accountNumber}</p>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex-1 bg-muted border-2 border-dashed border-border rounded-[28px] p-10 flex flex-col items-center justify-center gap-2 opacity-50">
                       <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No payout method configured</p>
                    </div>
                 )}

                 {/* Add or Change Method Button Card */}
                 <div 
                    onClick={() => {
                       setIsSettingUp(true);
                       setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                    }}
                    className="flex-1 bg-muted/40 border-2 border-dashed border-border rounded-[28px] flex flex-col items-center justify-center gap-3 p-10 cursor-pointer group hover:bg-muted transition-all shadow-sm"
                 >
                    <div className="w-14 h-14 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                       <Plus className="w-6 h-6 stroke-[3]" />
                    </div>
                    <span className="text-sm font-black text-muted-foreground uppercase tracking-widest group-hover:text-foreground">Add New Payout Method</span>
                 </div>
              </div>
           </div>

           {/* Setup Popover Form (Dynamic) */}
           {isSettingUp && (
              <div ref={formRef} className="bg-card border-2 border-primary/20 rounded-[40px] p-10 shadow-2xl flex flex-col gap-8 animate-in zoom-in-95 scroll-mt- transition-all duration-700 h-fit overflow-hidden">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground tracking-tight">Configure Payout Account</h3>
                    <button onClick={() => setIsSettingUp(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-6 h-6" /></button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSetupMethod("KHALTI")}
                      className={`py-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-3 transition-all ${setupMethod === 'KHALTI' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}
                    >
                      <CreditCard className="w-5 h-5" /> Khalti
                    </button>
                    <button 
                      onClick={() => setSetupMethod("BANK")}
                      className={`py-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-3 transition-all ${setupMethod === 'BANK' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}
                    >
                      <Building2 className="w-5 h-5" /> Bank Transfer
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Account Holder Name</label>
                       <input value={setupData.accountName} onChange={e => setSetupData({...setupData, accountName: e.target.value})} placeholder="Full name registered on account" className="w-full bg-muted text-foreground p-5 rounded-[22px] font-black text-md outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">{setupMethod === 'KHALTI' ? 'Mobile Number' : 'Account/IBAN No.'}</label>
                       <input value={setupData.accountNumber} onChange={e => setSetupData({...setupData, accountNumber: e.target.value})} placeholder={setupMethod === 'KHALTI' ? "98xxxxxxxx" : "Account Number"} className="w-full bg-muted text-foreground p-5 rounded-[22px] font-black text-md outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all" />
                    </div>
                 </div>

                 <button onClick={handleSavePayoutMethod} disabled={isSubmitting} className="bg-foreground text-background py-5 rounded-[22px] font-black text-lg flex items-center justify-center gap-3">
                   {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5 text-background fill-primary" />}
                   Link Verified Method
                 </button>
              </div>
           )}

           {/* Request Payout Form */}
           <div className="flex flex-col gap-8">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-black text-foreground tracking-tight ml-1">Amount</label>
                    <input 
                       type="number" 
                       value={amount}
                       onChange={e => setAmount(Number(e.target.value))}
                       placeholder="Enter amount to withdraw..." 
                       className="w-full bg-muted border border-border p-5 rounded-[24px] font-black text-2xl outline-none focus:ring-4 focus:ring-primary/20 focus:bg-background text-foreground transition-all tracking-tight" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-black text-foreground tracking-tight ml-1">Remark</label>
                    <textarea 
                       value={remarks}
                       onChange={e => setRemarks(e.target.value)}
                       placeholder="Optional remarks..." 
                       className="w-full bg-muted border border-border p-5 rounded-[24px] font-black text-lg min-h-[180px] outline-none focus:ring-4 focus:ring-primary/20 focus:bg-background text-foreground transition-all resize-none" 
                    />
                 </div>
              </div>

              <button 
                onClick={handlePayoutRequest}
                disabled={isSubmitting || amount > stats.currentBalance || amount < 100}
                className="w-full bg-[#008d4a] text-white py-5 rounded-[24px] font-black text-xl shadow-xl shadow-emerald-500/10 hover:bg-[#007a40] transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-white" /> : "Request Payout"}
              </button>
           </div>

        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-500">
           {/* Dynamic Payout History Table */}
           <div className="bg-card border border-border rounded-[40px] overflow-hidden shadow-sm">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-muted border-b border-border">
                       <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Requested On</th>
                       <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Method</th>
                       <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                       <th className="px-10 py-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Amount</th>
                    </tr>
                 </thead>
                 <tbody>
                    {payouts.length === 0 ? (
                       <tr><td colSpan={4} className="px-10 py-24 text-center text-muted-foreground italic">No payout history found on this account.</td></tr>
                    ) : payouts.map((p) => (
                       <tr key={p._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-all">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-muted-foreground/50" />
                                <span className="font-black text-foreground tracking-tight text-md">
                                   {new Date(p.createdAt).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">{p.payoutMethod}</span>
                          </td>
                          <td className="px-10 py-8">
                             <div className={`flex items-center gap-2 text-xs font-black tracking-tight ${
                                p.status === 'SUCCESS' ? 'text-emerald-500' :
                                p.status === 'PENDING' ? 'text-amber-500' : 'text-rose-500'
                             }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  p.status === 'SUCCESS' ? 'bg-emerald-500' :
                                  p.status === 'PENDING' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-rose-500'
                                }`}></div>
                                {p.status}
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <span className="font-black text-foreground text-lg tracking-tighter">NPR {p.amountNPR.toLocaleString()}</span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

    </div>
  );
}
