"use client";

import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

import { ToastProvider } from "@/components/ui/toast";

const ThemeWrapper = dynamic(() => import("./ThemeWrapper"), {
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </ToastProvider>
    </SessionProvider>
  );
}
