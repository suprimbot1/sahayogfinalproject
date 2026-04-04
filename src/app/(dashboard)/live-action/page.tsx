"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Play, Loader2, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LiveActionPage() {
  const { data: session } = useSession();
  const [liveTips, setLiveTips] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // 1. Initial Fetch of recent tips
  useEffect(() => {
    fetch("/api/transactions")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLiveTips(data.transactions);
        }
      })
      .catch(console.error);
  }, []);

  // 2. Real-time listener for new tips
  useEffect(() => {
    const eventSource = new EventSource("/api/live-alerts");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Prepend new tip to list
        setLiveTips(prev => [
          {
            _id: data.id,
            supporter: { name: data.supporter },
            financials: { amountNPR: data.amount },
            message: data.message,
            createdAt: data.timestamp,
            paymentMethod: "LIVE"
          },
          ...prev
        ]);
      } catch (err) {
        // Skip heartbeat
      }
    };

    return () => eventSource.close();
  }, []);

  const triggerTestAlert = async () => {
    setIsTesting(true);
    try {
      // Hit our transactions endpoint with mock data
      // This will trigger the MongoDB Change Stream and thus the SSE event
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: session?.user?.email?.split("@")[0] || "tester", // Just to find the profile
          supporterName: "Test Supporter",
          amount: Math.floor(Math.random() * 900) + 100,
          message: "This is a test alert! 🚀",
        })
      });
      console.log("Test alert triggered");
    } catch (err) {
      console.error("Test alert failed", err);
    } finally {
      setIsTesting(false);
    }
  };

  const openOverlay = () => {
    window.open("/overlay", "SahayogOverlay", "width=1280,height=720");
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1200px]">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Live Action</h1>
          <p className="text-sm text-muted-foreground">
            View your recent tips received in real-time.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            disabled={isTesting}
            onClick={triggerTestAlert}
            className="bg-white border border-border hover:bg-muted text-foreground font-bold px-6 py-2 rounded-full transition-colors flex items-center gap-2 text-sm"
          >
            {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Test Alert
          </button>
          <button 
            onClick={openOverlay}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2 rounded-full transition-colors flex items-center gap-2 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Open Overlay
          </button>
        </div>
      </div>

      {/* Live List */}
      <div className="flex flex-col gap-4">
        {liveTips.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl">
              📢
            </div>
            <p className="text-muted-foreground font-medium">Waiting for your first live tip...</p>
          </div>
        ) : liveTips.map((tip, i) => (
          <div key={tip._id || i} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-4 animate-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                {(tip.supporter?.name || "A")[0].toUpperCase()}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="font-black text-foreground text-base">{tip.supporter?.name}</span>
                <span className="w-1.5 h-1.5 bg-muted rounded-full"></span>
                <span className="text-muted-foreground font-medium">
                  {new Date(tip.createdAt).toLocaleString()}
                </span>
                <span className="w-1.5 h-1.5 bg-muted rounded-full"></span>
                <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-sm">
                   <Sparkles className="w-3.5 h-3.5" />
                   Rs. {tip.financials?.amountNPR}
                </div>
              </div>
            </div>
            {tip.message && (
              <div className="text-base text-foreground/95 bg-muted/30 p-4 rounded-xl border border-border/20 italic font-medium ml-14">
                "{tip.message}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
