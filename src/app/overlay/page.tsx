"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Coins, CheckCircle2, AlertCircle } from "lucide-react";

export default function OverlayPage() {
  const { data: session, status } = useSession();
  
  const [alert, setAlert] = useState<any>(null);
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

        // 2. Setup SSE Connection
        const eventSource = new EventSource(`/api/live-alerts?creatorId=${creatorId}`);
        
        eventSource.onopen = () => {
          setConnectionStatus("connected");
          setTimeout(() => setShowStatus(false), 5000); // Hide after 5 sec
        };

        eventSource.onmessage = (event) => {
          if (event.data === ": heartbeat") return;
          try {
            const data = JSON.parse(event.data);
            setAlert(data);
            setIsVisible(true);

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
          setConnectionStatus("error");
          eventSource.close();
        };

        return () => eventSource.close();
      } catch (err) {
        setConnectionStatus("error");
      }
    }

    if (status !== "loading") {
      initOverlay();
    }
  }, [status, usernameParam]);

  // Fallback for missing identity
  if (connectionStatus === "error" && !usernameParam && status === "unauthenticated") {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white p-10 font-sans">
        <div className="max-w-md bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 space-y-4">
           <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
           <h1 className="text-2xl font-black">Overlay Identity Missing</h1>
           <p className="text-sm text-slate-400 leading-relaxed">
             This overlay needs a <strong>username</strong> to know which stream to watch. 
           </p>
           <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-emerald-400 break-all">
             http://localhost:3000/overlay?username=YOUR_NAME
           </div>
           <p className="text-xs text-slate-500">
             Replace <code>YOUR_NAME</code> with your unique Sahayog username.
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-transparent font-sans select-none pointer-events-none">
      
      {/* Connection Status Indicator */}
      {showStatus && (
        <div className={`absolute top-4 left-4 p-3 rounded-full flex items-center gap-3 transition-opacity duration-1000 ${connectionStatus === "connected" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/10 text-white animate-pulse"}`}>
           {connectionStatus === "connected" ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
           <span className="text-[10px] font-black uppercase tracking-widest">
              {connectionStatus === "connected" ? `Connected to ${usernameParam || "stream"}` : "Connecting to Sahayog..."}
           </span>
        </div>
      )}

      {/* Main Alert Component */}
      <div 
        className={`absolute top-10 left-1/2 -translate-x-1/2 transition-all duration-1000 transform ${
          isVisible 
          ? "translate-y-0 opacity-100 scale-100" 
          : "-translate-y-32 opacity-0 scale-75 blur-lg"
        }`}
      >
        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-3 pr-12 border border-primary/20 flex items-center min-w-[400px] relative overflow-hidden">
          
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

          {/* Icon Circle / Image */}
          <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center relative z-10 shadow-lg shrink-0 overflow-hidden">
             {config?.media?.imageUri ? (
               <img src={config.media.imageUri} className="w-full h-full object-cover" alt="Alert" />
             ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 animate-ping rounded-full scale-150"></div>
                  <Coins className="w-10 h-10 text-white stroke-[3px] relative z-10" />
                </div>
             )}
          </div>

          <div className="ml-8 flex flex-col justify-center relative z-10 pr-4">
             <div 
               className="font-black leading-tight drop-shadow-sm"
                style={{ 
                  fontSize: (config?.typography?.fontSize || 48) / 1.5, 
                  color: config?.typography?.color || "#10b981", 
                  fontWeight: config?.typography?.fontWeight || 900 
                }}
             >
                {(config?.typography?.messageTemplate || "{tipper} tipped Rs.{amount}!!")
                  .replace("{tipper}", alert?.supporter || "Someone")
                  .replace("{amount}", alert?.amount?.toString() || "0")}
             </div>
          </div>
        </div>
        
        {/* External Comment Bubble */}
        {alert?.message && (
            <div className={`mt-6 mx-auto max-w-[80%] bg-white/95 backdrop-blur-xl rounded-[24px] py-4 px-8 shadow-2xl border border-white/50 text-center transition-all duration-1000 delay-500 scale-110`}>
              <p className="text-gray-800 font-bold italic text-lg leading-snug">
                "{alert.message}"
              </p>
            </div>
        )}
      </div>

    </div>
  );
}
