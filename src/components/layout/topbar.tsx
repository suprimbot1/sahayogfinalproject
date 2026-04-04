import { ChevronDown } from "lucide-react";
import Image from "next/image";

export function Topbar() {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-end px-6 fixed top-0 right-0 left-64 z-10 w-[calc(100%-16rem)]">
      <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
        <div className="flex flex-col text-right">
          <span className="text-sm font-semibold leading-none mb-1">
            Suprim Adhikari
          </span>
          <span className="text-xs text-muted-foreground leading-none">
            suprimbot0105@gmail.com
          </span>
        </div>
        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border">
          {/* We use a placeholder matching the style */}
          <div className="w-full h-full bg-pink-500/20 flex items-center justify-center text-pink-700 font-bold">
            SA
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>
    </header>
  );
}
