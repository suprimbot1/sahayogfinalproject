"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <Topbar />
      <main className="pl-64 pt-16 w-full min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </>
  );
}
