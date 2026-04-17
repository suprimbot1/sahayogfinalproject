import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Topbar } from "@/components/layout/topbar";
import dbConnect from "@/lib/mongoose";
import UserProfile from "@/models/UserProfile";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // @ts-ignore - Using custom role appended in auth.ts
  if (session.user.role !== "SUPER_ADMIN") {
    // If not a super admin, redirect to normal dashboard
    redirect("/dashboard");
  }

  return (
    <>
      <AdminSidebar />
      <Topbar />
      <main className="pl-64 pt-16 w-full min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </>
  );
}
