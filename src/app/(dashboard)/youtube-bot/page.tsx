"use client";

import { useState, useEffect } from "react";
import { Trash2, MonitorPlay as YoutubeIcon, HelpCircle, LogIn, Loader2, Users } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function YoutubeBotPage() {
  const { data: session, status } = useSession();
  const [channelInfo, setChannelInfo] = useState<any>(null);
  const [isFetchingChannel, setIsFetchingChannel] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setIsFetchingChannel(true);
      fetch("/api/youtube/channel")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setChannelInfo(data);
          }
        })
        .finally(() => setIsFetchingChannel(false));
    }
  }, [status]);

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header Info */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Youtube Bot</h1>
        <p className="text-sm text-muted-foreground">
          Configure youtube bot to send tips alert to your youtube live streams.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-bold text-foreground">Connected Channels</h2>

        {status === "loading" ? (
          <div className="p-8 flex items-center justify-center">Loading...</div>
        ) : session ? (
          <>
            {/* Message Preview Box */}
            <div className="bg-[#fffdf5] border border-[#fdeeba] rounded-xl p-4 flex gap-3 shadow-sm">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-amber-900">Message Preview on Youtube</span>
                <p className="text-sm text-amber-900/80">
                  (tipper): {"{tip_amount}"} {"{tip_page_url}"} Message: {"{user_message}"}
                </p>
              </div>
            </div>

            {/* Connected Channel Card */}
            <div className="bg-card border border-border rounded-2xl p-8 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex flex-col items-center justify-center shrink-0 overflow-hidden border border-border">
                  {isFetchingChannel ? (
                    <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                  ) : channelInfo?.thumbnail || session.user?.image ? (
                    <img src={channelInfo?.thumbnail || session.user?.image || ""} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <YoutubeIcon className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg text-foreground tracking-tight">
                      {isFetchingChannel ? "Fetching Channel..." : channelInfo?.title || session.user?.name || "Connected Account"}
                    </span>
                    {channelInfo && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                  </div>
                  {channelInfo ? (
                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {new Intl.NumberFormat().format(channelInfo.subscriberCount)} Subscribers</span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground">{session.user?.email}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={async () => {
                    alert("Sending test alert...");
                    const res = await fetch("/api/youtube/test-alert", { method: "POST" });
                    const data = await res.json();
                    if(data.success) alert("Sent successfully to your livestream!");
                    else alert("Failed: " + data.error);
                  }}
                  className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  Test Alert
                </button>
                {/* Toggle */}
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
                {/* Disconnect button */}
                <div onClick={() => signOut()} className="w-8 h-8 rounded bg-destructive/10 flex items-center justify-center cursor-pointer hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 shadow-sm h-64">
            <YoutubeIcon className="w-12 h-12 text-muted-foreground opacity-50" />
            <div className="max-w-md">
              <h3 className="font-bold text-lg text-foreground">Connect your YouTube Channel</h3>
              <p className="text-sm text-muted-foreground mt-1">Authenticate with Google to allow Sahayog to read your stream chat and post tip alerts directly to your live stream.</p>
            </div>
            <button 
              onClick={() => signIn("google", { callbackUrl: "/youtube-bot" })}
              className="mt-4 bg-[#ea4335] hover:bg-[#d33a2e] text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
