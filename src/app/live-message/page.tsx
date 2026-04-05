"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, AlertCircle } from "lucide-react";

export default function LiveMessageOverlay() {
  const [config, setConfig] = useState<any>(null);
  const [tips, setTips] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connecting");
  
  // Parse username from URL
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const usernameParam = searchParams?.get("username");

  useEffect(() => {
    async function initOverlay() {
      try {
        if (!usernameParam) {
          setConnectionStatus("error");
          return;
        }

        // 1. Find Creator Profile
        const profileRes = await fetch(`/api/profile?username=${usernameParam}`);
        const profileData = await profileRes.json();
        
        if (!profileData.success) {
          setConnectionStatus("error");
          return;
        }

        const creatorId = profileData.profile.userId;

        // 2. Fetch Message Overlay Config
        const configRes = await fetch(`/api/message-overlay/config?userId=${creatorId}`);
        const configData = await configRes.json();
        setConfig(configData);

        // 3. Fetch Initial Recent Tips
        const tipsRes = await fetch(`/api/transactions?username=${usernameParam}`);
        const tipsData = await tipsRes.json();
        if (tipsData.success) {
           // Mapping for consistency with SSE data shape
           const initialTips = tipsData.transactions.map((t: any) => ({
             id: t._id,
             supporter: t.supporter.name,
             amount: t.financials.amountNPR,
             message: t.message,
             timestamp: t.createdAt
           }));
           setTips(initialTips.slice(0, configData.numberOfTips || 5));
        }

        // 4. Setup SSE Connection for Live Updates
        const eventSource = new EventSource(`/api/live-alerts?creatorId=${creatorId}`);
        
        eventSource.onopen = () => {
          setConnectionStatus("connected");
        };

        eventSource.onmessage = (event) => {
          if (event.data === ": heartbeat") return;
          try {
            const newTip = JSON.parse(event.data);
            setTips(prev => {
                const updated = [newTip, ...prev];
                return updated.slice(0, configData.numberOfTips || 5);
            });
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
        console.error("Overlay Init Error:", err);
        setConnectionStatus("error");
      }
    }

    initOverlay();
  }, [usernameParam]);

  if (connectionStatus === "error" || !usernameParam) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white p-10 font-sans">
        <div className="max-w-md bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 space-y-4">
           <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
           <h1 className="text-2xl font-black text-white">Overlay Identity Missing</h1>
           <p className="text-sm text-slate-400">Please provide a valid username in the URL.</p>
        </div>
      </div>
    );
  }

  if (!config) {
     return <div className="h-screen w-screen flex items-center justify-center bg-transparent"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { 
          background-color: transparent !important; 
        }
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Roboto:wght@400;500;600;700;800;900&display=swap');
      ` }} />
      
      <div 
        className="h-screen w-screen p-10 overflow-hidden font-sans select-none pointer-events-none flex flex-col"
        style={{ 
            fontFamily: config.fontConfig.fontFamily,
            justifyContent: config.messageFlow === 'up' ? 'flex-end' : 'flex-start'
        }}
      >
        <div className={`flex flex-col gap-4 ${config.messageFlow === 'up' ? 'flex-col-reverse' : 'flex-col'}`}>
          {tips.length === 0 ? (
            <div 
                className="p-6 text-center italic opacity-50"
                style={{ 
                    backgroundColor: config.boxItemConfig.backgroundColor,
                    color: config.colorConfig.tipperTextColor,
                    borderRadius: config.boxItemConfig.borderRadius,
                    opacity: config.boxItemConfig.backgroundOpacity / 100
                }}
            >
              {config.emptyTipMessage}
            </div>
          ) : (
            tips.map((tip, idx) => (
              <div 
                key={tip.id || idx}
                className="p-4 flex flex-col gap-2 shadow-lg animate-in slide-in-from-left duration-500"
                style={{
                  backgroundColor: `${config.boxItemConfig.backgroundColor}${Math.round((config.boxItemConfig.backgroundOpacity / 100) * 255).toString(16).padStart(2, '0')}`,
                  borderRadius: config.boxItemConfig.borderRadius,
                  border: config.showGatewayBadge ? `1px solid ${config.colorConfig.gatewayBadgeColor}44` : 'none'
                }}
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     {config.showGatewayBadge && (
                       <div 
                         className="w-2 h-2 rounded-full"
                         style={{ backgroundColor: config.colorConfig.gatewayBadgeColor }}
                       ></div>
                     )}
                     <span 
                        style={{ 
                            color: config.colorConfig.tipperTextColor,
                            fontWeight: config.fontConfig.tipperFontWeight,
                            fontSize: config.fontConfig.tipperFontSize
                        }}
                     >
                        {tip.supporter}
                     </span>
                   </div>
                   <span 
                      style={{ 
                          color: config.colorConfig.amountTextColor,
                          fontWeight: config.fontConfig.amountFontWeight,
                          fontSize: config.fontConfig.amountFontSize
                      }}
                   >
                      Rs. {tip.amount}
                   </span>
                </div>
                
                {config.showUserMessage && tip.message && (
                  <div 
                    className="text-xs italic border-t border-white/10 pt-2 mt-1"
                    style={{ color: config.colorConfig.userMessageColor }}
                  >
                    {tip.message}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
