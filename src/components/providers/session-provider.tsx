"use client";

import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

const ThemeWrapper = dynamic(() => import("./ThemeWrapper"), {
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeWrapper>
        {children}
      </ThemeWrapper>
    </SessionProvider>
  );
}
