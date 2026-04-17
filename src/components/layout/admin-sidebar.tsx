"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldAlert,
  Settings2,
  LineChart,
} from "lucide-react";

const adminMenu = [
  {
    title: "Global Overview",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "Creators",
    icon: Users,
    href: "/admin/creators",
  },
];

const financeMenu = [
  {
    title: "Global Payouts",
    icon: CreditCard,
    href: "/admin/payouts",
  },
  {
    title: "Revenue Log",
    icon: LineChart,
    href: "/admin/revenue",
  },
];

const moderationMenu = [
  {
    title: "Reports & Logs",
    icon: ShieldAlert,
    href: "/admin/reports",
  },
  {
    title: "Global Settings",
    icon: Settings2,
    href: "/admin/settings",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const renderLink = (item: any) => {
    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
      >
        <item.icon
          className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
        />
        {item.title}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border overflow-y-auto">
      {/* Brand */}
      <div className="h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            S
          </div>
          <span className="font-bold text-xl tracking-tight text-red-600">Sahayog Admin</span>
        </Link>
      </div>

      <div className="px-4 py-4 flex flex-col gap-6">
        {/* Main Section */}
        <div>
          <h4 className="px-4 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">
            Workspace
          </h4>
          <div className="flex flex-col gap-1">{adminMenu.map(renderLink)}</div>
        </div>

        {/* Finance Section */}
        <div>
          <h4 className="px-4 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">
            Finance
          </h4>
          <div className="flex flex-col gap-1">
            {financeMenu.map(renderLink)}
          </div>
        </div>

        {/* Moderation Section */}
        <div>
          <h4 className="px-4 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">
            Moderation
          </h4>
          <div className="flex flex-col gap-1">
            {moderationMenu.map(renderLink)}
          </div>
        </div>
      </div>
    </aside>
  );
}
