"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Coins, CheckCircle2, AlertCircle } from "lucide-react";

export default function OverlayPage() {
  const { data: session, status } = useSession();
  
  const [alert, setAlert] = useState<any>(null);
  const [recentTips, setRecentTips] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [showStatus, setShowStatus] = useState(true);

  // Parse username from URL
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const usernameParam = searchParams?.get("username");

  useEffect(() => {
    async function initOverlay() {
      try {
        let creatorId = session?.user?.id;
        let username = usernameParam;

        // If no session but has username param, find the creatorId first
        if (!creatorId && username) {
           const profileRes = await fetch(`/api/profile?username=${username}`);
           const profileData = await profileRes.json();
           if (profileData.success) {
              creatorId = profileData.profile.userId;
           }
        }

        if (!creatorId) {
          setConnectionStatus("error");
          return;
        }

        // 1. Fetch Alert Config
        const configRes = await fetch(`/api/alerts/config?userId=${creatorId}`);
        const configData = await configRes.json();
        setConfig(configData);

        // 2. Fetch Initial Recent Tips (Hall of Fame)
        if (username) {
          const tipsRes = await fetch(`/api/transactions?username=${username}`);
          const tipsData = await tipsRes.json();
          if (tipsData.success) {
             const mapped = tipsData.transactions.slice(0, 4).map((t: any) => ({
               id: t._id,
               supporter: t.supporter.name,
               amount: t.financials.amountNPR,
             }));
             setRecentTips(mapped);
          }
        }

        // 3. Setup SSE Connection
        const eventSource = new EventSource(`/api/live-alerts?creatorId=${creatorId}`);
        
        eventSource.onopen = () => {
          setConnectionStatus("connected");
          setTimeout(() => setShowStatus(false), 5000); // Hide after 5 sec
        };

        eventSource.onmessage = (event) => {
          if (event.data === ": heartbeat") return;
          try {
            const data = JSON.parse(event.data);
            
            // Trigger Hero Alert
            setAlert(data);
            setIsVisible(true);

            // Update Recent Tips List (Limit to 4)
            setRecentTips(prev => {
              const updated = [data, ...prev.filter(t => t.id !== data.id)];
              return updated.slice(0, 4);
            });

            // Audio Playback
            if (configData?.media?.soundUri) {
              const audio = new Audio(configData.media.soundUri);
              audio.volume = (configData.settings?.soundVolume || 80) / 100;
              audio.play().catch(e => console.error("Audio Play Error:", e));
            }

            // Duration Toggle
            const duration = (configData?.settings?.duration || 10) * 1000;
            setTimeout(() => setIsVisible(false), duration);
          } catch (e) {
            console.error("SSE Parse Error:", e);
          }
        };

        eventSource.onerror = () => {
          console.warn("SSE Connection lost. Retrying in 5 seconds...");
          setConnectionStatus("connecting");
          eventSource.close();
          setTimeout(initOverlay, 5000); // Auto-reconnect after 5s
        };

        return () => eventSource.close();
      } catch (err) {
        console.error("Overlay Connection Error:", err);
        setConnectionStatus("error");
        setTimeout(initOverlay, 10000); // Retry after 10s on hard failure
      }
    }

    if (status !== "loading") {
      initOverlay();
    }
  }, [status, usernameParam]);

  // Fallback for missing identity or connection error
  if (connectionStatus === "error") {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white p-10 font-sans">
        <div className="max-w-md bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 space-y-4">
           <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
           <h1 className="text-2xl font-black">Overlay Identity Missing</h1>
           <p className="text-sm text-slate-400 leading-relaxed">
             This overlay needs a <strong>username</strong> to know which stream to watch. 
           </p>
           <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-emerald-400 break-all">
             {typeof window !== "undefined" ? window.location.origin : "https://sahayoghost.vercel.app"}/overlay?username=YOUR_NAME
           </div>
           <p className="text-xs text-slate-500">
             Replace <code>YOUR_NAME</code> with your unique Sahayog username.
           </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: transparent !important; }
        @keyframes popIn {
          0% { transform: scale(0.5) translateY(100px); opacity: 0; }
          70% { transform: scale(1.1) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-pop-in { animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      ` }} />
      
      <div className="relative h-screen w-screen overflow-hidden bg-transparent font-sans select-none pointer-events-none flex items-center justify-center">
        
        {/* Connection Status (Small & Subtle) */}
        {showStatus && (
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-opacity duration-1000">
             {connectionStatus === "connected" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Loader2 className="w-3 h-3 animate-spin text-white" />}
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
                {connectionStatus === "connected" ? "Stream Connected" : "Link-Syncing..."}
             </span>
          </div>
        )}

        {/* 1. LAYER: PERSISTENT SUPPORTERS LIST (The "Hall of Fame") */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-3 w-[800px] animate-in fade-in slide-in-from-bottom-5 duration-1000">
           <div className="flex items-center gap-2 mb-1 px-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Recent Activity</span>
           </div>
           {recentTips.map((tip, i) => (
              <div 
                key={tip.id || i}
                className="bg-gradient-to-r from-[#0a1128] to-[#060b1d] backdrop-blur-3xl border border-white/5 rounded-2xl py-4 px-8 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.4)] transition-all duration-500 animate-in slide-in-from-left-10"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                 <div className="flex items-center gap-5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    <span className="font-black text-white text-xl tracking-tight uppercase italic">{tip.supporter}</span>
                 </div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">NPR</span>
                    <span className="font-black text-[#d4af37] text-2xl tracking-tighter drop-shadow-2xl">{tip.amount}</span>
                 </div>
              </div>
           ))}
        </div>

        {/* 2. LAYER: HIGH-IMPACT HERO ALERT (Pop-up) */}
        <div 
          className={`flex flex-col items-center gap-8 transition-all duration-700 transform ${
            isVisible 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-75 translate-y-24 blur-xl"
          }`}
        >
          {/* Asset Section (GIF / Image) */}
          <div className="relative group">
             <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse group-hover:bg-primary/40 transition-all"></div>
             <div className="relative z-10 w-[320px] h-[320px] rounded-[40px] overflow-hidden border-4 border-white/20 shadow-2xl bg-slate-900/50 backdrop-blur-sm flex items-center justify-center animate-float">
                {config?.media?.imageUri ? (
                  <img src={config.media.imageUri} className="w-full h-full object-cover" alt="Tip Alert" />
                ) : (
                  <Coins className="w-24 h-24 text-primary animate-bounce" />
                )}
             </div>
          </div>

          {/* Text Content Section */}
          <div className="flex flex-col items-center text-center gap-4 relative z-10">
             <div 
               className="font-black tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
               style={{ 
                 fontSize: config?.typography?.fontSize || 56,
                 lineHeight: 0.9
               }}
             >
                {(config?.typography?.messageTemplate || "{tipper} tipped Rs.{amount}!!")
                   .split(/(Rs\.\d+)/g).map((part: string, i: number) => (
                      <span key={i} style={part.startsWith('Rs.') ? { color: config?.typography?.color || '#10b981' } : {}}>
                        {part.replace("{tipper}", alert?.supporter || "Someone")
                             .replace("{amount}", alert?.amount?.toString() || "0")}
                      </span>
                   ))
                }
             </div>

             {/* User Message Bubble */}
             {alert?.message && (
               <div className="mt-4 max-w-lg animate-pop-in [animation-delay:400ms] opacity-0">
                  <div className="bg-white/10 backdrop-blur-2xl border border-white/20 px-8 py-5 rounded-[32px] shadow-2xl relative">
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/10 rotate-45 border-l border-t border-white/20"></div>
                     <p className="text-white font-bold text-xl italic tracking-tight leading-relaxed">
                        "{alert.message}"
                     </p>
                  </div>
               </div>
             )}
          </div>

        </div>

      </div>

    </>
  );
}
