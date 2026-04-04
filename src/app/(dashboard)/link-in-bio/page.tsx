import { Copy, ExternalLink, Plus } from "lucide-react";

export default function LinkInBioPage() {
  return (
    <div className="flex flex-col xl:flex-row gap-8 bg-card rounded-2xl border border-border p-8 shadow-sm min-h-[calc(100vh-10rem)]">
      {/* Left Settings Panel */}
      <div className="flex-1 max-w-2xl">
        <div className="flex flex-col h-full gap-8">
          {/* User Profile Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex flex-col items-center justify-center shrink-0 text-foreground font-bold border border-green-100">
              Ji
            </div>
            <div className="flex-1 mt-1">
              <h2 className="text-xl font-bold text-foreground">@JiGGL3</h2>
              <p className="text-sm text-muted-foreground mt-1">
                A short bio about you
              </p>
              
              {/* Social Icons Placeholder */}
              <div className="flex items-center gap-2 mt-3">
                {['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'Twitch', 'X', 'YouTube'].map((social, i) => (
                  <div key={i} className="relative w-6 h-6 bg-muted rounded-md flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer transition-all">
                    <span className="text-[10px]">{social[0]}</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-muted border border-background rounded-full flex items-center justify-center">
                      <Plus className="w-2 h-2 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add New Link Button */}
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-5 h-5" />
            Add New Link
          </button>
        </div>
      </div>

      {/* Right Phone Preview Panel */}
      <div className="xl:flex-1 flex flex-col items-center">
        {/* URL Bar */}
        <div className="w-full max-w-sm mb-6 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted/30 border border-border rounded-xl px-4 py-2 text-sm text-muted-foreground">
            <span className="truncate">https://cr8.rs.me/JiGGL3</span>
            <Copy className="w-4 h-4 ml-auto hover:text-foreground cursor-pointer" />
          </div>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
            Share
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Phone Mockup Frame */}
        <div className="relative w-[320px] h-[650px] bg-background border-[12px] border-muted rounded-[2.5rem] shadow-xl overflow-hidden shrink-0">
          {/* Inner Phone Screen */}
          <div className="relative w-full h-full bg-[#0a1128] overflow-hidden flex flex-col pt-12 pb-6 px-6">
            {/* Starry Background Effect */}
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_1px,transparent_1px)]" style={{ backgroundSize: '24px 24px' }}></div>
            
            {/* Phone Header */}
            <div className="relative z-10 flex justify-between items-start mb-12">
              <div className="text-primary font-bold text-xl tracking-tight flex items-center">
                cr<span className="bg-primary text-background rounded-[2px] px-0.5 mx-[1px] rotate-12 text-lg">8</span>rs.
              </div>
              <ExternalLink className="w-5 h-5 text-white/50" />
            </div>

            {/* Profile Avatar & Handle */}
            <div className="relative z-10 flex flex-col items-center gap-4 mt-8">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-foreground">
                J
              </div>
              <h3 className="text-xl font-semibold text-primary">@JiGGL3</h3>
            </div>

            {/* Empty Links Space */}
            <div className="flex-1 relative z-10 mt-8">
              {/* Added links would appear here */}
            </div>

            {/* Footer */}
            <div className="relative z-10 flex flex-col items-center gap-2 mt-auto">
              <div className="flex items-center gap-2 text-[10px] text-white/60">
                <span className="hover:underline cursor-pointer">Terms of Service</span>
                <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                <span className="hover:underline cursor-pointer">Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
