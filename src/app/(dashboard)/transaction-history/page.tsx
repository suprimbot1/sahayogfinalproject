"use client";

import { useState, useEffect } from "react";
import { Download, Loader2, Coins, Calendar, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function TransactionHistoryPage() {
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState("tip");
  const [isLoading, setIsLoading] = useState(true);
  
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
        fetch("/api/transactions")
          .then(res => res.json())
          .then(data => {
            if (data.success) {
               setTransactions(data.transactions);
            }
          })
          .finally(() => setIsLoading(false));
    }
  }, [status]);

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Header Info */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-foreground font-black tracking-tight">Transaction Ledger</h1>
          <p className="text-sm text-muted-foreground">
            View your verified tip history and platform settlement details.
          </p>
        </div>
        <button className="bg-white border border-border hover:bg-muted text-foreground font-bold px-6 py-2 rounded-full whitespace-nowrap transition-colors flex items-center gap-2 text-sm shadow-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-border/50">
        <button
          onClick={() => setActiveTab("tip")}
          className={`pb-3 text-sm font-black uppercase tracking-widest relative transition-colors ${
            activeTab === "tip" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Tip History
          {activeTab === "tip" && (
            <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-primary rounded-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("transaction")}
          className={`pb-3 text-sm font-black uppercase tracking-widest relative transition-colors ${
            activeTab === "transaction" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          System Ledger
          {activeTab === "transaction" && (
            <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-primary rounded-full"></div>
          )}
        </button>
      </div>

      {activeTab === "tip" && (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-[#fafafa] border-b border-border">
                <tr>
                  <th className="px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Supporter</th>
                  <th className="px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                  <th className="px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Amount</th>
                  <th className="px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Net Earnings</th>
                  <th className="px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {transactions.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic font-medium">No transactions recorded yet.</td></tr>
                ) : transactions.map((row) => (
                  <tr key={row._id} className="hover:bg-muted/10 transition-all duration-300 group">
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-foreground text-sm flex items-center gap-2">
                               {row.supporter?.name}
                               {row.status === "COMPLETED" && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[250px] italic">"{row.message || "No message"}"</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          row.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {row.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="font-black text-gray-500">Rs. {row.financials?.amountNPR}</span>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`font-black text-sm ${row.status === "COMPLETED" ? "text-primary" : "text-muted-foreground"}`}>
                           Rs. {row.financials?.netAmountNPR}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-bold text-xs uppercase tracking-tighter">
                        {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "transaction" && (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
           <div className="p-8 border-b border-border bg-[#fafafa]">
              <div className="flex items-center gap-4 text-sm font-bold text-foreground">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Coins className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="line-height-[1.2]">System Ledger Summary</h3>
                    <p className="text-[11px] text-muted-foreground font-medium italic uppercase tracking-wider">Displaying fees and total settleable volumes</p>
                 </div>
              </div>
           </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fefefe] border-b border-border">
                <tr>
                  <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Type</th>
                  <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Description</th>
                  <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Amount</th>
                  <th className="px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Total Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {transactions.filter(t => t.status === "COMPLETED").map((row) => (
                  <>
                    <tr key={`${row._id}-base`} className="hover:bg-muted/5 transition-colors">
                      <td className="px-8 py-5"><ArrowUpCircle className="w-5 h-5 text-emerald-500" /></td>
                      <td className="px-8 py-5 text-sm font-bold">Tip from {row.supporter?.name}</td>
                      <td className="px-8 py-5 font-mono text-xs">+ Rs. {row.financials?.amountNPR}</td>
                      <td className="px-8 py-5 font-black text-emerald-600">Rs. {row.financials?.amountNPR}</td>
                    </tr>
                    <tr key={`${row._id}-fee`} className="bg-muted/5 border-l-4 border-l-amber-500">
                      <td className="px-8 py-4 opacity-50"><ArrowDownCircle className="w-4 h-4 text-amber-500" /></td>
                      <td className="px-8 py-4 text-xs font-bold text-muted-foreground italic">Platform Service Charge (5%)</td>
                      <td className="px-8 py-4 font-mono text-[10px] italic text-muted-foreground">- Rs. {row.financials?.platformFeeNPR}</td>
                      <td className="px-8 py-4 font-bold text-xs text-amber-600">- Rs. {row.financials?.platformFeeNPR}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckCircle2({ className }: { className: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
}
