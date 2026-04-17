export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center relative font-sans dark text-white">
      {/* Background glow matching the screenshot */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-[45%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1d1f3b] via-[#0b0c16]/50 to-transparent blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-[440px] px-4 relative z-10">
        {children}
      </div>
      
      <div className="fixed bottom-6 right-6 z-20">
        <button className="w-12 h-12 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-xs text-white/50 hover:text-white hover:bg-[#1a1a1a] transition-all">
           Need
           <br/>
           help?
        </button>
      </div>
    </div>
  );
}
