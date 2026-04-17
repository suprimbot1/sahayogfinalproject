import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/mongoose";
import UserProfile from "@/models/UserProfile";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import mongoose from "mongoose";

export default async function AdminUsersPage() {
  await dbConnect();

  // Fetch all creators
  const profiles = await UserProfile.find({ role: { $ne: "SUPER_ADMIN" } })
    .sort({ createdAt: -1 })
    .lean();

  const creators = await Promise.all(
    profiles.map(async (profile: any) => {
      // Fetch the actual Youtube/Google name from NextAuth's 'users' collection
      let youtubeName = profile.username;
      try {
        const db = mongoose.connection.db;
        if (db) {
          const userDoc = await db.collection("users").findOne({
            _id: new mongoose.Types.ObjectId(profile.userId)
          });
          if (userDoc?.name) {
            youtubeName = userDoc.name;
          }
        }
      } catch (e) {
        console.error("Failed to fetch user doc for profile", profile.userId);
      }
      return { ...profile, youtubeName };
    })
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Creators Directory</h1>
        <p className="text-sm text-muted-foreground">Manage and view all registered users.</p>
      </div>

      <Card className="bg-card shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">All Registered Creators</CardTitle>
        </CardHeader>
        <CardContent>
          {creators.length === 0 ? (
             <div className="text-sm text-muted-foreground py-8 text-center bg-muted/5 rounded-xl border border-border">
               No creators found.
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg font-bold">Username</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold">Joined</th>
                    <th className="px-4 py-3 font-bold">Payout Method</th>
                    <th className="px-4 py-3 rounded-tr-lg font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creators.map((user: any) => (
                    <tr key={user._id.toString()} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 font-bold text-foreground flex items-center gap-2">
                        {user.youtubeName}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 uppercase"><ShieldCheck className="w-3 h-3"/> Active</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-1 rounded-full">
                           {user.payoutDetails?.method || "Unset"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                           <Link 
                             href={`/${user.username}`} 
                             target="_blank"
                             className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                           >
                             View <ExternalLink className="w-3 h-3" />
                           </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
