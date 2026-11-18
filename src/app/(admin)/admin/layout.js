import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = { title: "Admin – SOROB · Rihla'26" };

async function AdminGuard({ children }) {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  if (s.user.role !== "admin") redirect("/"); // signed in, but not an admin
  return <>{children}</>;
}

function AdminSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 animate-pulse" aria-busy="true" aria-label="Loading admin">
      <div className="h-11 w-2/3 rounded-2xl bg-sky-200/70" />
      <div className="h-24 rounded-3xl bg-sky-200/70" />
      <div className="h-24 rounded-3xl bg-sky-200/70" />
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-sky-50">
      <Suspense fallback={<AdminSkeleton />}>
        <AdminGuard>
          <main className="mx-auto max-w-6xl p-4">
            <AdminNav />
            {children}
          </main>
        </AdminGuard>
      </Suspense>
    </div>
  );
}