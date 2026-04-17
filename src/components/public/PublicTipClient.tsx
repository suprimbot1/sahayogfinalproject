"use client";

import { useState, useEffect } from "react";
import { IUserProfile } from "@/models/UserProfile";
import { ChevronRight, ChevronLeft, Mail, Loader2 } from "lucide-react";

export function PublicTipClient({ profile, youtubeName }: { profile: any, youtubeName?: string }) {
  const [activeTab, setActiveTab] = useState("tips");
  const quickAmounts = [100, 300, 500, 1000, 1500, 2000, 2500, 5000];
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [message, setMessage] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [email, setEmail] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isTipping, setIsTipping] = useState(false);
  const [recentTips, setRecentTips] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState("allTime");
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  const displayUsername = youtubeName || profile?.username?.toUpperCase() || "CREATOR";
  const coverImage = profile?.coverImage || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop";
  const profileImage = profile?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop";

  // Handle Khalti redirect query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("payment");
    if (status === "success") {
       alert("🎉 Thank you very much! Your tip was successfully processed via Khalti!");
       // Clean the URL safely without reloading the page
       window.history.replaceState(null, "", window.location.pathname);
    } else if (status === "cancelled") {
       alert("Payment cancelled.");
       window.history.replaceState(null, "", window.location.pathname);
    } else if (status === "failed") {
       alert("⚠️ Payment verification failed with gateway.");
       window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Fetch true latest supporters from DB on mount
  useEffect(() => {
    if (profile?.username) {
        fetch(`/api/transactions?username=${profile?.username}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
               setRecentTips(data.transactions);
            }
          })
          .catch(console.error);
    }
  }, [profile?.username]);

  // Fetch Leaderboard
  useEffect(() => {
    if (profile?.username) {
        setIsLeaderboardLoading(true);
        fetch(`/api/leaderboard?username=${profile?.username}&period=${leaderboardPeriod}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
               setLeaderboard(data.leaderboard);
            }
          })
          .finally(() => setIsLeaderboardLoading(false));
    }
  }, [profile?.username, leaderboardPeriod]);

  const handleTip = async () => {
    if (!termsAgreed) {
      alert("Please agree to the Terms and Conditions first.");
      return;
    }
    if (!supporterName.trim()) {
      alert("Please enter a username so the creator knows who tipped!");
      return;
    }

    setIsTipping(true);
    
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: profile.username,
          supporterName,
          email,
          amount: selectedAmount,
          message
        })
      });
      
      const json = await res.json();
      if (json.success && json.payment_url) {
         // Redirect the user to Khalti's secure checkout portal
         window.location.href = json.payment_url;
      } else {
         alert("Failed: " + json.error);
      }
    } catch (e) {
      alert("An error occurred trying to process tip.");
    } finally {
      setIsTipping(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Hero Card */}
      <div className="w-full bg-white dark:bg-card/50 backdrop-blur-3xl rounded-3xl border border-slate-200 dark:border-border/50 shadow-sm mt-8 overflow-hidden transition-colors">
        {/* Cover Image */}
        <div 
          className="w-full h-48 md:h-64 bg-primary/20 bg-center bg-cover bg-no-repeat relative"
          style={{ backgroundImage: `url('${coverImage}')` }}
        ></div>

        <div className="px-6 md:px-10 relative pt-4 pb-0">
          {/* Avatar Base */}
          <div className="absolute -top-16 md:-top-20 left-6 md:left-10 w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white dark:border-background shadow-md bg-white dark:bg-background">
             <img src={profileImage} alt={profile?.username} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex justify-between items-start ml-32 md:ml-40 mt-1 md:mt-2">
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              {displayUsername}
            </h1>
            
            <div className="text-right flex flex-col items-end leading-tight text-sm">
              <span className="text-primary font-bold">Social</span>
              <span className="font-bold text-foreground">Links</span>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="flex items-center gap-10 border-b border-border mt-8 px-2 md:px-4">
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-4 text-[15px] font-bold relative transition-colors ${
                activeTab === "about" ? "text-primary" : "text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground"
              }`}
            >
              About
              {activeTab === "about" && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-primary rounded-t-lg"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("tips")}
              className={`pb-4 text-[15px] font-bold relative transition-colors ${
                activeTab === "tips" ? "text-primary" : "text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground"
              }`}
            >
              Tips
              {activeTab === "tips" && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-primary rounded-t-lg"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Grid Context */}
      {activeTab === "about" && (
        <div className="mt-8 bg-white dark:bg-card/50 backdrop-blur-3xl rounded-3xl border border-slate-200 dark:border-border/50 p-8 min-h-[300px] transition-colors">
           <h2 className="text-xl font-bold mb-4">About {displayUsername}</h2>
           <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
             {profile?.about || "This creator hasn't written an about section yet."}
           </p>
        </div>
      )}

      {activeTab === "tips" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Tip Form Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-card/50 backdrop-blur-3xl rounded-3xl border border-slate-200 dark:border-border/50 shadow-sm p-6 md:p-8 flex flex-col gap-6 transition-colors">
              
              {/* Username Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Username</label>
                <input 
                  type="text" 
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  placeholder="Your Name (e.g. Ayush)"
                  className="w-full bg-white/50 dark:bg-background/50 border border-slate-200 dark:border-border/50 rounded-xl p-3.5 text-sm font-medium text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <p className="text-[13px] text-muted-foreground mt-0.5">Use proper username to standout in leaderboard.</p>
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Email (Optional)</label>
                <div className="relative" suppressHydrationWarning>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/50 dark:bg-background/50 border border-slate-200 dark:border-border/50 rounded-xl p-3.5 text-sm font-medium text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
                    suppressHydrationWarning
                  />
                  <Mail className="w-5 h-5 text-primary absolute right-4 top-[14px]" />
                </div>
              </div>

              {/* Amount Inputs */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-foreground">Amount</label>
                <div className="flex w-full">
                  <div className="border border-slate-200 dark:border-border/50 border-r-0 rounded-l-xl px-4 flex items-center gap-2 bg-slate-50 dark:bg-muted/20 shrink-0">
                     <span className="text-lg">🇳🇵</span>
                     <span className="font-bold text-sm text-slate-600 dark:text-muted-foreground">NPR</span>
                     <svg className="w-4 h-4 text-slate-400 dark:text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <input 
                    type="number" 
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(Number(e.target.value))}
                    className="w-full bg-white/50 dark:bg-background/50 border border-slate-200 dark:border-border/50 rounded-r-xl p-3.5 text-sm font-bold text-slate-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                
                {/* Quick amount chips */}
                <div className="flex flex-wrap gap-2 md:gap-3 mt-1">
                  {quickAmounts.map(amt => (
                    <button 
                      key={amt}
                      onClick={() => setSelectedAmount(amt)}
                      className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                        selectedAmount === amt 
                        ? "border-primary dark:border-primary/50 bg-primary/10 text-primary" 
                        : "border-slate-200 dark:border-border/50 bg-white dark:bg-background/50 text-slate-600 dark:text-muted-foreground hover:border-slate-300 dark:hover:border-border hover:bg-slate-50 dark:hover:bg-muted dark:hover:text-foreground"
                      }`}
                    >
                       Rs. {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={profile?.settings?.maxMessageLength || 99}
                  placeholder="Enter your message"
                  className="w-full bg-white/50 dark:bg-background/50 border border-slate-200 dark:border-border/50 rounded-xl p-3.5 text-sm font-medium text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-muted-foreground/50 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
                ></textarea>
                <div className="text-right text-[13px] text-muted-foreground font-medium">
                  {message.length} / {profile?.settings?.maxMessageLength || 99} characters
                </div>
              </div>

              {/* TOS and Submit */}
              <div className="flex flex-col gap-5 mt-2">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTermsAgreed(!termsAgreed)}>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${termsAgreed ? 'bg-primary border-primary' : 'border-border bg-card/50'}`}>
                    {termsAgreed && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm font-bold text-foreground">I agree to all the Terms and Conditions</span>
                </div>
                
                <button 
                  disabled={isTipping}
                  onClick={handleTip}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-[15px] py-4 rounded-full transition-all shadow-md hover:shadow-lg mt-2 flex items-center justify-center gap-2"
                >
                  {isTipping ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Tip"}
                </button>
              </div>

            </div>
          </div>

          {/* Widgets Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white dark:bg-card/50 backdrop-blur-3xl rounded-3xl border border-slate-200 dark:border-border/50 shadow-sm p-6 transition-colors">
              <h3 className="font-bold text-lg text-foreground mb-4">Leaderboard</h3>
              
              <div className="flex items-center justify-between border-b border-border/50 text-[13px] font-bold text-muted-foreground mb-6">
                {["daily", "weekly", "monthly", "allTime"].map((p) => (
                  <button 
                    key={p}
                    onClick={() => setLeaderboardPeriod(p)}
                    className={`pb-3 capitalize transition-all ${leaderboardPeriod === p ? "text-primary border-b-2 border-primary" : "text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground"}`}
                  >
                    {p === "allTime" ? "All Time" : p}
                  </button>
                ))}
              </div>

              {isLeaderboardLoading ? (
                 <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : leaderboard.length > 0 ? (
                 <div className="flex flex-col gap-4">
                   {leaderboard.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] ${idx === 0 ? "bg-yellow-100 text-yellow-700" : idx === 1 ? "bg-gray-100 text-gray-700" : idx === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"}`}>
                           {idx + 1}
                        </div>
                        <span className="text-sm font-bold text-foreground truncate flex-1">{item.name}</span>
                        <span className="text-sm font-black text-primary">Rs. {item.amount}</span>
                     </div>
                   ))}
                 </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center opacity-70">
                    <div className="w-24 h-24 mb-2 bg-gradient-to-b from-muted to-muted/50 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                    <span className="text-5xl drop-shadow-md relative z-10">🐷</span>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-background/40 blur-xl"></div>
                    </div>
                    <h4 className="font-black text-lg text-foreground">No tips received</h4>
                    <p className="text-sm text-muted-foreground max-w-[200px]">Be the first one to climb up the leaderboard</p>
                </div>
              )}
            </div>

            {/* Latest Supporters Card */}
            <div className="bg-white dark:bg-card/50 backdrop-blur-3xl rounded-3xl border border-slate-200 dark:border-border/50 shadow-sm p-0 overflow-hidden transition-colors">
               <div className="px-6 py-5 border-b border-border/50">
                 <h3 className="font-bold text-[15px] text-foreground">Latest Supporters</h3>
               </div>
               
               <div className="flex flex-col">
                 {recentTips.length > 0 ? recentTips.slice(0, 5).map((tip, idx) => (
                   <div key={idx} className="flex flex-col p-5 border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors gap-1">
                     <div className="flex justify-between items-center w-full">
                       <span className="text-sm font-bold text-foreground truncate">{tip.supporter?.name || "Anonymous"}</span>
                       <span className="text-[13px] font-bold text-primary shrink-0">Rs. {tip.financials?.amountNPR || 0}</span>
                     </div>
                     {tip.message && (
                       <p className="text-[13px] text-muted-foreground leading-snug pr-4">
                         {tip.message}
                       </p>
                     )}
                   </div>
                 )) : (
                    <div className="p-8 text-center text-sm text-muted-foreground opacity-70 font-semibold">No recent tips found.</div>
                 )}
               </div>

               {/* Pagination footer */}
               <div className="p-4 flex items-center justify-center gap-4 bg-slate-50 dark:bg-white/[0.02]">
                 <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-border/50 bg-white dark:bg-background/50 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-muted transition-colors text-slate-500 dark:text-muted-foreground"><ChevronLeft className="w-4 h-4" /></button>
                 <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-border/50 bg-white dark:bg-background/50 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-muted transition-colors text-slate-900 dark:text-foreground"><ChevronRight className="w-4 h-4" /></button>
               </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
