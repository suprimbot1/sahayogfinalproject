"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronUp, EyeOff, Info, Activity, Heart } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    todaysEarnings: 0,
    currentBalance: 0
  });

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-pink-100 flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-pink-700">SA</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Hello, {session?.user?.name || "Creator"}</h1>
          <p className="text-sm text-muted-foreground">
            Manage your tools, earnings and payouts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Progress */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Your profile progress
              </h2>
              <p className="text-xs text-muted-foreground">
                Finish these steps to personalize your setup and start using
                cr8rs smoothly.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium">
                2 of 3 items completed
              </span>
              <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "66%" }}
                ></div>
              </div>
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Step 1 */}
            <div className="flex items-center justify-between bg-primary/5 border-l-4 border-primary p-4 rounded-lg bg-card shadow-sm border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Build your tip profile
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Create your tip profile so people can recognize and tip you.
                  </p>
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-primary fill-primary/20" />
            </div>

            {/* Step 2 */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-card shadow-sm border border-border/50 ring-1 ring-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="text-lg">🔗</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Add social links
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Add your social links to share it in tip page and your link-in
                    bio.
                  </p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30"></div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-card shadow-sm border border-border/50 bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <span className="text-lg">💵</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Setup your payout account
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Add your payout details to withdraw your tips.
                  </p>
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-foreground fill-foreground/10" />
            </div>
          </div>
        </div>

        {/* Add Social Links Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-[#e0fcf1] to-[#e7f7fd] p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="z-10 relative space-y-2 mb-6">
            <h3 className="font-bold text-lg text-foreground">Add social links</h3>
            <p className="text-sm text-foreground/70 pr-12">
              Add your social links to share it in tip page and your link-in bio.
            </p>
          </div>
          <button className="z-10 relative bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-full w-fit">
            Add Social Links
          </button>
          {/* Abstract Illustration Placeholder */}
          <div className="absolute -right-4 -bottom-4 w-40 h-40 opacity-80 pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://api.dicebear.com/7.x/identicon/svg?seed=social&backgroundColor=transparent')] bg-contain bg-no-repeat bg-bottom"></div>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Your Balance */}
        <div className="bg-gradient-to-br from-[#dcfcf2] via-[#e5f8f5] to-[#cbf7ee] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-foreground/80">
                Your Balance
              </span>
              <EyeOff className="w-4 h-4 text-foreground/50" />
            </div>
            <h2 className="text-3xl font-black text-primary tracking-tight">
              Rs. {stats.currentBalance.toLocaleString()}
            </h2>
          </div>
          <div className="flex items-center gap-4 mt-8">
            <button className="bg-transparent border border-primary text-primary hover:bg-primary/5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              Withdraw
            </button>
            <button className="text-primary text-sm font-medium hover:underline">
              View History
            </button>
          </div>
        </div>

        {/* Payout Processing */}
        <div className="bg-gradient-to-br from-[#fef7df] via-[#fffbf2] to-[#ffeed2] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-foreground/80">
                Payout Processing
              </span>
              <Info className="w-4 h-4 text-foreground/50" />
            </div>
            <h2 className="text-3xl font-black text-amber-500 tracking-tight">
              Rs. 0
            </h2>
          </div>
        </div>

        {/* Card hold balance */}
        <div className="bg-gradient-to-br from-[#fae7e6] via-[#fcf0ef] to-[#fcdcdb] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-destructive/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-foreground/80">
                Card hold balance
              </span>
              <Info className="w-4 h-4 text-foreground/50" />
            </div>
            <h2 className="text-3xl font-black text-red-500 tracking-tight">
              Rs. 0
            </h2>
          </div>
        </div>
      </div>

      {/* Total Earning */}
      <div className="bg-card rounded-2xl border border-border p-6 mt-4 shadow-sm min-h-[300px] flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">
              Total Earning
            </h3>
            <h2 className="text-2xl font-bold text-foreground">Rs. {stats.totalEarnings.toLocaleString()}</h2>
          </div>
          <select className="bg-background border border-border rounded-lg text-sm px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
          </select>
        </div>
        <div className="flex-1 flex items-center justify-center border-t border-dashed border-border mt-4">
          <p className="text-muted-foreground text-sm">No data available</p>
        </div>
      </div>
    </div>
  );
}
