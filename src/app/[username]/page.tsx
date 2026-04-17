import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import UserProfile from "@/models/UserProfile";
import Link from "next/link";
import { PublicTipClient } from "@/components/public/PublicTipClient";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function PublicPage(props: { 
  params: Promise<{ username: string }> 
}) {
  const { username } = await props.params;

  if (!username) {
    notFound();
  }

  await dbConnect();

  // Find the profile based on the dynamic route username parameter
  const profile = await UserProfile.findOne({ 
    username: String(username).toLowerCase() 
  });

  if (!profile) {
    notFound();
  }

  // Fetch the actual Youtube/Google name from NextAuth's 'users' collection
  let youtubeName = profile.username;
  try {
    const client = await clientPromise;
    const db = client.db();
    const userDoc = await db.collection("users").findOne({
      _id: new ObjectId(profile.userId)
    });
    if (userDoc?.name) {
      youtubeName = userDoc.name as string;
    }
  } catch (e) {
    console.error("Failed to fetch user doc for profile", profile.userId);
  }

  // Convert the Mongoose document to a safe leaning JSON object to pass to Client Components
  const safeProfile = JSON.parse(JSON.stringify(profile));

  return (
    <div className="min-h-screen bg-[#fbfdfc] dark:bg-background flex flex-col font-sans transition-colors">
      {/* Top Brand Strip */}
      <header className="w-full bg-white dark:bg-card border-b border-slate-200 dark:border-border py-4 px-8 flex items-center justify-between z-10 relative">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            S
          </div>
          <span className="font-bold text-xl tracking-tight text-primary">Sahayog</span>
        </Link>
        <Link 
          href="/dashboard"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 rounded-full transition-colors text-sm"
        >
          Go to Dashboard
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full flex justify-center pb-20">
        <div className="w-full max-w-5xl px-4 xl:px-0">
          <PublicTipClient profile={safeProfile} youtubeName={youtubeName} />
        </div>
      </main>
    </div>
  );
}
