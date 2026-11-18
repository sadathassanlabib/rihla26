import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

async function MeGuard({ children }) {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  if (s.user.role !== "registered") redirect("/status");

  return <main className="p-4 max-w-2xl mx-auto">{children}</main>;
}

export default function MeLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-slate-400">Loading profile…</div>
      }
    >
      <MeGuard>{children}</MeGuard>
    </Suspense>
  );
}