"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Coins, CheckCircle2, AlertCircle, Volume2 } from "lucide-react";

export default function OverlayPage() {
  const { data: session, status } = useSession();
  
  const [alert, setAlert] = useState<any>(null);
  const [recentTips, setRecentTips] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [showStatus, setShowStatus] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  // Parse username from URL
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const usernameParam = searchParams?.get("username");

  const unlockAudio = () => {
    const audio = new Audio();
    audio.play().catch(() => {}); // Play silent sound to unlock context
    setIsAudioEnabled(true);
  };

  useEffect(() => {
    async function initOverlay() {
      try {
        let creatorId: string | null = null;
        let username = usernameParam;

        if (username) {
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

        const configRes = await fetch(`/api/alerts/config?userId=${creatorId}`);
        const configData = await configRes.json();
        if (configData && !configData.error) {
           setConfig(configData);
        }

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

        const eventSource = new EventSource(`/api/live-alerts?creatorId=${creatorId}`);
        
        eventSource.onopen = () => {
          setConnectionStatus("connected");
          setTimeout(() => setShowStatus(false), 8000);
        };

        eventSource.onmessage = (event) => {
          if (event.data === ": heartbeat") return;
          try {
            const data = JSON.parse(event.data);
            setAlert(data);
            setIsVisible(true);

            setRecentTips(prev => {
              const exists = prev.some(t => t.id === data.id);
              if (exists) return prev;
              return [data, ...prev].slice(0, 4);
            });

            if (configData?.media?.soundUri) {
              const audio = new Audio(configData.media.soundUri);
              audio.volume = (configData.settings?.soundVolume || 80) / 100;
              audio.play().catch(e => console.error("Audio Blocked:", e));
            }

            const duration = (configData?.settings?.duration || 10) * 1000;
            setTimeout(() => setIsVisible(false), duration);
          } catch (e) {
            console.error("SSE Parse Error:", e);
          }
        };

        eventSource.onerror = () => {
          setConnectionStatus("connecting");
          eventSource.close();
          setTimeout(initOverlay, 5000); 
        };

        return () => eventSource.close();
      } catch (err) {
        setConnectionStatus("error");
        setTimeout(initOverlay, 10000);
      }
    }

    if (status !== "loading") {
      initOverlay();
    }
  }, [status, usernameParam]);

  if (connectionStatus === "error") {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white p-10 font-sans">
        <div className="max-w-md bg-slate-800 p-8 rounded-[40px] shadow-2xl border border-slate-700 space-y-4 text-center">
           <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
           <h1 className="text-2xl font-black">Identity Required</h1>
           <p className="text-sm text-slate-400 break-all">
             /overlay?username=YOUR_NAME
           </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=Poppins:wght@400;900&family=Roboto:wght@400;900&family=Montserrat:wght@400;900&family=Bungee&family=Anton&family=Rubik:wght@900&display=swap');
        body { background-color: transparent !important; margin: 0; overflow: hidden; }
        @keyframes popIn {
          0% { transform: scale(0.5) translateY(100px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { filter: blur(40px) opacity(0.5); }
          50% { filter: blur(60px) opacity(0.8); }
        }
        .animate-pop-in { animation: popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-glow { animation: glowPulse 3s ease-in-out infinite; }
      ` }} />
      
      <div 
        className="relative h-screen w-screen bg-transparent select-none font-sans overflow-hidden"
        style={{ fontFamily: config?.typography?.fontFamily || 'Inter' }}
      >
        
        {/* Audio Unlock Interaction (Crucial for OBS Sound) */}
        {!isAudioEnabled && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-[2px] pointer-events-auto">
             <button 
               onClick={unlockAudio}
               className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-[32px] shadow-2xl flex items-center gap-4 animate-bounce transition-all active:scale-95"
             >
                <Volume2 className="w-6 h-6" />
                <span>ENABLE OVERLAY AUDIO</span>
             </button>
          </div>
        )}

        <div className="pointer-events-none h-full w-full relative flex items-center justify-center">
            
            {/* Connection Status */}
            {showStatus && (
              <div className="absolute top-10 left-10 flex items-center gap-3 bg-black/40 backdrop-blur-3xl px-6 py-3 rounded-full border border-white/10 transition-opacity">
                 {connectionStatus === "connected" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Loader2 className="w-4 h-4 animate-spin text-white" />}
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">
                    {connectionStatus === "connected" ? "Broadcast Ready" : "Syncing..."}
                 </span>
              </div>
            )}

            {/* 1. LAYER: PERSISTENT BROADCAST BAR (HALL OF FAME) - RESPONSIVE */}
            <div className="absolute bottom-12 left-0 right-0 px-6 sm:px-12 flex flex-col items-center">
               <div className="w-full max-w-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2 px-6">
                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#10b981]"></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30 italic">Sahayog Activity</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                     {recentTips.map((tip, i) => (
                        <div 
                          key={tip.id || i}
                          className="bg-gradient-to-r from-[#0a1128]/90 to-[#060b1d]/90 backdrop-blur-3xl border border-white/5 rounded-2xl py-4 px-8 flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-left-10 duration-700"
                          style={{ animationDelay: `${i * 150}ms` }}
                        >
                           <div className="flex items-center gap-4 min-w-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
                              <span className="font-black text-white text-lg sm:text-xl tracking-tighter uppercase italic truncate">{tip.supporter}</span>
                           </div>
                           <div className="flex items-baseline gap-2 shrink-0">
                              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">Rs.</span>
                              <span className="font-black text-[#d4af37] text-xl sm:text-2xl tracking-tighter drop-shadow-2xl">{tip.amount}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* 2. LAYER: HIGH-IMPACT HERO ALERT */}
            <div 
              className={`flex flex-col items-center gap-10 transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) transform ${
                isVisible 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-75 translate-y-24 blur-3xl"
              }`}
            >
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-glow"></div>
                 <div className="relative z-10 w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] rounded-[50px] overflow-hidden border-[6px] border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] bg-slate-900/40 backdrop-blur-md flex items-center justify-center">
                    {config?.media?.imageUri ? (
                      <img src={config.media.imageUri} className="w-full h-full object-contain drop-shadow-2xl" alt="Alert" />
                    ) : (
                      <Coins className="w-32 h-32 text-primary animate-bounce shadow-primary" />
                    )}
                 </div>
              </div>

              <div className="flex flex-col items-center text-center gap-6 relative z-10 max-w-4xl px-12">
                 <div 
                   className="font-black tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                   style={{ 
                     fontSize: config?.typography?.fontSize || 56,
                     lineHeight: 0.85,
                     textShadow: `0 4px 0 rgba(0,0,0,0.2), 0 0 30px ${config?.typography?.color || '#10b981'}40`
                   }}
                 >
                    {(config?.typography?.messageTemplate || "{tipper} tipped Rs.{amount}!!")
                       .split(/(Rs\.\d+)/g).map((part: string, i: number) => (
                          <span key={i} style={part.startsWith('Rs.') ? { 
                             color: config?.typography?.color || '#10b981',
                             textShadow: `0 0 40px ${config?.typography?.color || '#10b981'}80`
                          } : { color: '#ffffff' }}>
                            {part.replace("{tipper}", alert?.supporter || "Someone")
                                 .replace("{amount}", alert?.amount?.toString() || "0")}
                          </span>
                       ))
                    }
                 </div>

                 {alert?.message && (
                   <div className="bg-white/[0.08] backdrop-blur-3xl border border-white/10 px-10 py-6 sm:px-12 sm:py-8 rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] animate-pop-in">
                      <p className="text-white font-black text-xl sm:text-2xl italic tracking-tight leading-relaxed max-w-xl">
                         "{alert.message}"
                      </p>
                      <div className="mt-6 flex justify-center">
                         <div className="h-1.5 w-20 bg-primary/40 rounded-full"></div>
                      </div>
                   </div>
                 )}
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
