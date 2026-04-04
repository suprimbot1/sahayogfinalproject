"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link as LinkIcon,
  Settings2,
  Bell,
  Target,
  MessageSquare,
  Radio,
  MonitorPlay as Youtube,
  RefreshCw,
  CreditCard,
  History,
  MessageCircle,
  Bug,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Link in Bio",
    icon: LinkIcon,
    href: "/link-in-bio",
  },
  {
    title: "Tips",
    icon: Settings2,
    href: "/tips/configuration",
  },
];

const streamingItems = [
  {
    title: "Alert Box",
    icon: Bell,
    href: "/alerts",
  },
  {
    title: "Tip Goal",
    icon: Target,
    href: "/tips/goals",
    isNew: true,
  },
  {
    title: "Message Overlay",
    icon: MessageSquare,
    href: "/overlay",
  },
  {
    title: "Live Action",
    icon: Radio,
    href: "/live-action",
  },
  {
    title: "Youtube Bot",
    icon: Youtube,
    href: "/youtube-bot",
  },
  {
    title: "MultiStream",
    icon: RefreshCw,
    href: "/multistream",
  },
];

const financeItems = [
  {
    title: "Payout",
    icon: CreditCard,
    href: "/payout",
  },
  {
    title: "Transaction History",
    icon: History,
    href: "/transaction-history",
  },
];

const supportItems = [
  {
    title: "Discord Support",
    icon: MessageCircle,
    href: "/support/discord",
  },
  {
    title: "WhatsApp Support",
    icon: MessageCircle,
    href: "/support/whatsapp",
  },
  {
    title: "Bug Report",
    icon: Bug,
    href: "/support/bug-report",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const renderLink = (item: any) => {
    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        }`}
      >
        <item.icon
          className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
        />
        {item.title}
        {item.isNew && (
          <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
            New
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border overflow-y-auto">
      {/* Brand */}
      <div className="h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* Mock Logo matching exact styling shape using CSS */}
          <div className="flex items-center text-primary font-bold text-2xl tracking-tight">
            <span>cr</span>
            <span className="bg-primary text-background rounded-sm px-1 ml-0.5 mr-0.5 rotate-12">
              8
            </span>
            <span>rs</span>
          </div>
        </Link>
      </div>

      <div className="px-4 py-4 flex flex-col gap-6">
        {/* Main Section */}
        <div className="flex flex-col gap-1">{menuItems.map(renderLink)}</div>

        {/* Streaming Section */}
        <div>
          <h4 className="px-4 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">
            Streaming
          </h4>
          <div className="flex flex-col gap-1">
            {streamingItems.map(renderLink)}
          </div>
        </div>

        {/* Finance Section */}
        <div>
          <h4 className="px-4 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">
            Finance
          </h4>
          <div className="flex flex-col gap-1">
            {financeItems.map(renderLink)}
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="px-4 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">
            Support
          </h4>
          <div className="flex flex-col gap-1">
            {supportItems.map(renderLink)}
          </div>
        </div>
      </div>
    </aside>
  );
}
