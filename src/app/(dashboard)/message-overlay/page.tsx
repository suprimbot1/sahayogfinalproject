"use client";

import { useState, useEffect } from "react";
import { Copy, EyeOff, Loader2, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/toast";

export default function MessageOverlayPage() {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error, info } = useToast();
  
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const [formData, setFormData] = useState({
    theme: "Custom",
    messageFlow: "down",
    showUserMessage: true,
    showGatewayBadge: true,
    showBoxTitle: false,
    emptyTipMessage: "No tips received yet. Be the first to tip!",
    numberOfTips: 3,
    pageConfig: { pageColor: "#ffffff", pageOpacity: 0 },
    fontConfig: {
      fontFamily: "Poppins",
      tipperFontWeight: 600,
      tipperFontSize: 16,
      amountFontWeight: 800,
      amountFontSize: 18,
    },
    colorConfig: {
      amountTextColor: "#ffd300",
      tipperTextColor: "#ffffff",
      userMessageColor: "#cfcfcf",
      gatewayBadgeColor: "#e21b4d",
    },
    boxItemConfig: {
      backgroundColor: "#00205b",
      backgroundOpacity: 85,
      borderRadius: 16,
    },
  });

  // Fetch Data
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then(res => res.json())
        .then(data => {
          if (data?.username) setUsername(data.username);
        });

      fetch("/api/message-overlay/config")
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setFormData(prev => ({ ...prev, ...data }));
          }
        })
        .finally(() => setIsLoading(false));
    } else if (status === "unauthenticated") {
        setIsLoading(false);
    }
  }, [status]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/message-overlay/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) success("Message Overlay settings saved successfully!");
    } catch (e) {
      error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestOverlay = async () => {
     handleSave(); // save before testing
     try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          supporterName: "Test Fan",
          amount: 500,
          message: "Testing the Message Overlay!",
        })
      });
      success("Test message sent!");
     } catch (err) {
       error("Failed to send test message.");
     }
  };

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-foreground">Recent Tips Overlay</h1>
        <p className="text-sm text-muted-foreground">Show your latest supporters on your live-stream.</p>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-foreground">Widget URL</label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 flex items-center gap-2 bg-background border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground w-full">
            <span className="truncate flex-1 tracking-tight">{baseUrl}/live-message?username={username || "YOUR_NAME"}</span>
            <Copy onClick={() => { navigator.clipboard.writeText(`${baseUrl}/live-message?username=${username}`); info("Copied!", "Clipboard"); }} className="w-4 h-4 ml-auto hover:text-foreground cursor-pointer shrink-0" />
            <EyeOff className="w-4 h-4 hover:text-foreground cursor-pointer shrink-0 ml-1" />
          </div>
          <button onClick={handleTestOverlay} className="bg-white border border-border hover:bg-muted text-foreground font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-colors">
            Test Overlay
          </button>
          <button className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-colors">
            Clear Overlay Messages
          </button>
          <button onClick={() => window.open(`/live-message?username=${username}`, "Overlay", "width=1280,height=720")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-colors">
            Launch Overlay
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Use the URL as Browser Source in your Streaming Software like OBS Studio or Streamlabs OBS. Don't Share this link with anyone. (Recommended Configuration: 1920x1080)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <div className="border border-border rounded-2xl p-6 flex flex-col gap-5">
             <div className="flex gap-4 items-center justify-between">
                <label className="text-sm font-bold">Theme</label>
                <select 
                   value={formData.theme}
                   onChange={(e) => setFormData({...formData, theme: e.target.value})}
                   className="border border-border rounded-lg px-3 py-2 text-sm w-1/2"
                >
                   <option value="Custom">Custom</option>
                </select>
             </div>
             <div className="flex gap-4 items-center justify-between">
                <label className="text-sm font-bold">New Message flow</label>
                <select 
                   value={formData.messageFlow}
                   onChange={(e) => setFormData({...formData, messageFlow: e.target.value})}
                   className="border border-border rounded-lg px-3 py-2 text-sm w-1/2"
                >
                   <option value="true">true</option>
                   <option value="false">false</option>
                   <option value="up">up</option>
                   <option value="down">down</option>
                </select>
             </div>
          </div>

          <div className="border border-border rounded-2xl p-6 flex flex-col gap-5">
             <div className="flex flex-col gap-2">
               <label className="text-sm font-bold">Empty Tip Message</label>
               <input 
                  type="text" 
                  value={formData.emptyTipMessage}
                  onChange={(e) => setFormData({...formData, emptyTipMessage: e.target.value})}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm" 
               />
             </div>
             <div className="flex flex-col gap-2">
               <label className="text-sm font-bold">No of Tips</label>
               <input 
                  type="range" min="1" max="10" 
                  value={formData.numberOfTips}
                  onChange={(e) => setFormData({...formData, numberOfTips: Number(e.target.value)})}
                  className="w-full h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" 
               />
               <span className="text-xs bg-primary text-white w-fit px-2 rounded-full mx-auto">{formData.numberOfTips}</span>
             </div>
          </div>

          <div className="border border-border rounded-2xl p-6 flex flex-col gap-5">
             <div className="font-bold border-b border-border pb-2">Font Config</div>
             
             <div className="flex gap-4 items-center justify-between">
                <label className="text-sm font-bold">Font Family</label>
                <select 
                   value={formData.fontConfig.fontFamily}
                   onChange={(e) => setFormData({...formData, fontConfig: {...formData.fontConfig, fontFamily: e.target.value}})}
                   className="border border-border rounded-lg px-3 py-2 text-sm w-1/2"
                >
                   <option value="Poppins">Poppins</option>
                   <option value="Inter">Inter</option>
                   <option value="Roboto">Roboto</option>
                </select>
             </div>

             <div className="flex gap-4 items-center justify-between mt-2">
                <label className="text-sm font-bold">Tipper Font Weight</label>
                <select 
                   value={formData.fontConfig.tipperFontWeight}
                   onChange={(e) => setFormData({...formData, fontConfig: {...formData.fontConfig, tipperFontWeight: Number(e.target.value)}})}
                   className="border border-border rounded-lg px-3 py-2 text-sm w-1/2"
                >
                   <option value="400">400</option>
                   <option value="500">500</option>
                   <option value="600">600</option>
                   <option value="700">700</option>
                   <option value="800">800</option>
                </select>
             </div>

             <div className="flex flex-col gap-2">
               <label className="text-sm font-bold">Tipper Font Size</label>
               <input 
                  type="range" min="10" max="40" 
                  value={formData.fontConfig.tipperFontSize}
                  onChange={(e) => setFormData({...formData, fontConfig: {...formData.fontConfig, tipperFontSize: Number(e.target.value)}})}
                  className="w-full h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" 
               />
               <span className="text-xs bg-primary text-white w-fit px-2 rounded-full mx-auto">{formData.fontConfig.tipperFontSize}px</span>
             </div>

             <div className="flex gap-4 items-center justify-between mt-2">
                <label className="text-sm font-bold">Amount Font Weight</label>
                <select 
                   value={formData.fontConfig.amountFontWeight}
                   onChange={(e) => setFormData({...formData, fontConfig: {...formData.fontConfig, amountFontWeight: Number(e.target.value)}})}
                   className="border border-border rounded-lg px-3 py-2 text-sm w-1/2"
                >
                   <option value="400">400</option>
                   <option value="500">500</option>
                   <option value="600">600</option>
                   <option value="700">700</option>
                   <option value="800">800</option>
                </select>
             </div>

             <div className="flex flex-col gap-2">
               <label className="text-sm font-bold">Amount Font Size</label>
               <input 
                  type="range" min="10" max="40" 
                  value={formData.fontConfig.amountFontSize}
                  onChange={(e) => setFormData({...formData, fontConfig: {...formData.fontConfig, amountFontSize: Number(e.target.value)}})}
                  className="w-full h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" 
               />
               <span className="text-xs bg-primary text-white w-fit px-2 rounded-full mx-auto">{formData.fontConfig.amountFontSize}px</span>
             </div>
          </div>

          <div className="border border-border rounded-2xl p-6 flex flex-col gap-5">
             <div className="font-bold border-b border-border pb-2">Box Item Config</div>
             <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Background Color</label>
                <div className="flex items-center gap-3 border border-border p-2 rounded-lg">
                   <input 
                     type="color" 
                     value={formData.boxItemConfig.backgroundColor}
                     onChange={(e) => setFormData({...formData, boxItemConfig: {...formData.boxItemConfig, backgroundColor: e.target.value}})}
                     className="w-6 h-6 border-none cursor-pointer p-0 bg-transparent" 
                   />
                   <span className="text-sm flex-1">{formData.boxItemConfig.backgroundColor}</span>
                </div>
             </div>
             
             <div className="flex flex-col gap-2 mt-2">
               <label className="text-sm font-bold">Background Opacity</label>
               <input 
                  type="range" min="0" max="100" 
                  value={formData.boxItemConfig.backgroundOpacity}
                  onChange={(e) => setFormData({...formData, boxItemConfig: {...formData.boxItemConfig, backgroundOpacity: Number(e.target.value)}})}
                  className="w-full h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" 
               />
               <span className="text-xs bg-primary text-white w-fit px-2 rounded-full mx-auto">{formData.boxItemConfig.backgroundOpacity}%</span>
             </div>

             <div className="flex flex-col gap-2 mt-2">
               <label className="text-sm font-bold">Border Radius</label>
               <input 
                  type="range" min="0" max="40" 
                  value={formData.boxItemConfig.borderRadius}
                  onChange={(e) => setFormData({...formData, boxItemConfig: {...formData.boxItemConfig, borderRadius: Number(e.target.value)}})}
                  className="w-full h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" 
               />
               <span className="text-xs bg-primary text-white w-fit px-2 rounded-full mx-auto">{formData.boxItemConfig.borderRadius}px</span>
             </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <div className="border border-border rounded-2xl p-6 flex flex-col gap-5">
             <div className="flex gap-4 items-center justify-between">
                <label className="text-sm font-bold">Show User Message</label>
                <div 
                   onClick={() => setFormData({...formData, showUserMessage: !formData.showUserMessage})}
                   className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${formData.showUserMessage ? 'bg-primary' : 'bg-slate-200'}`}
                >
                   <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${formData.showUserMessage ? 'translate-x-4' : ''}`}></div>
                </div>
             </div>
             <div className="flex gap-4 items-center justify-between border-t border-border pt-4">
                <label className="text-sm font-bold">Show Gateway Badge</label>
                <div 
                   onClick={() => setFormData({...formData, showGatewayBadge: !formData.showGatewayBadge})}
                   className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${formData.showGatewayBadge ? 'bg-primary' : 'bg-slate-200'}`}
                >
                   <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${formData.showGatewayBadge ? 'translate-x-4' : ''}`}></div>
                </div>
             </div>
             <div className="flex gap-4 items-center justify-between border-t border-border pt-4">
                <label className="text-sm font-bold">Show Box Title</label>
                <div 
                   onClick={() => setFormData({...formData, showBoxTitle: !formData.showBoxTitle})}
                   className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${formData.showBoxTitle ? 'bg-primary' : 'bg-slate-200'}`}
                >
                   <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${formData.showBoxTitle ? 'translate-x-4' : ''}`}></div>
                </div>
             </div>
          </div>

          <div className="border border-border rounded-2xl p-6 flex flex-col gap-5">
             <div className="font-bold border-b border-border pb-2">Page Config</div>
             <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Page Color</label>
                <div className="flex items-center gap-3 border border-border p-2 rounded-lg">
                   <div className="w-6 h-6 rounded border border-border" style={{backgroundColor: formData.pageConfig.pageColor}}></div>
                   <input type="text" value={formData.pageConfig.pageColor} onChange={(e) => setFormData({...formData, pageConfig: {...formData.pageConfig, pageColor: e.target.value}})} className="border-none w-full outline-none text-sm"/>
                </div>
             </div>
             
             <div className="flex flex-col gap-2 mt-2">
               <label className="text-sm font-bold">Page Opacity</label>
               <input 
                  type="range" min="0" max="100" 
                  value={formData.pageConfig.pageOpacity}
                  onChange={(e) => setFormData({...formData, pageConfig: {...formData.pageConfig, pageOpacity: Number(e.target.value)}})}
                  className="w-full h-1 bg-muted rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" 
               />
               <span className="text-xs bg-primary text-white w-fit px-2 rounded-full mx-auto">{formData.pageConfig.pageOpacity}%</span>
             </div>
          </div>

          <div className="border border-border rounded-2xl p-6 flex flex-col gap-5">
             <div className="font-bold border-b border-border pb-2">Color Config</div>
             <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Amount Text Color</label>
                <div className="flex items-center gap-3 border border-border p-2 rounded-lg">
                   <input type="color" value={formData.colorConfig.amountTextColor} onChange={(e) => setFormData({...formData, colorConfig: {...formData.colorConfig, amountTextColor: e.target.value}})} className="w-6 h-6 border-none cursor-pointer p-0 bg-transparent" />
                   <span className="text-sm flex-1">{formData.colorConfig.amountTextColor}</span>
                </div>
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Tipper Text Color</label>
                <div className="flex items-center gap-3 border border-border p-2 rounded-lg">
                   <input type="color" value={formData.colorConfig.tipperTextColor} onChange={(e) => setFormData({...formData, colorConfig: {...formData.colorConfig, tipperTextColor: e.target.value}})} className="w-6 h-6 border-none cursor-pointer p-0 bg-transparent" />
                   <span className="text-sm flex-1">{formData.colorConfig.tipperTextColor}</span>
                </div>
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">User Message Color</label>
                <div className="flex items-center gap-3 border border-border p-2 rounded-lg">
                   <input type="color" value={formData.colorConfig.userMessageColor} onChange={(e) => setFormData({...formData, colorConfig: {...formData.colorConfig, userMessageColor: e.target.value}})} className="w-6 h-6 border-none cursor-pointer p-0 bg-transparent" />
                   <span className="text-sm flex-1">{formData.colorConfig.userMessageColor}</span>
                </div>
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Payment Gateway Badge Color</label>
                <div className="flex items-center gap-3 border border-border p-2 rounded-lg">
                   <input type="color" value={formData.colorConfig.gatewayBadgeColor} onChange={(e) => setFormData({...formData, colorConfig: {...formData.colorConfig, gatewayBadgeColor: e.target.value}})} className="w-6 h-6 border-none cursor-pointer p-0 bg-transparent" />
                   <span className="text-sm flex-1">{formData.colorConfig.gatewayBadgeColor}</span>
                </div>
             </div>
          </div>
          
          <button 
             onClick={handleSave} 
             disabled={isSaving}
             className="bg-primary hover:bg-primary/90 mt-4 text-primary-foreground font-bold px-6 py-4 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
             {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
             Save All Configurations
          </button>
        </div>

      </div>
    </div>
  );
}
