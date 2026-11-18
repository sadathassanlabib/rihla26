import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireRole(...roles) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  if (!roles.includes(session.user.role))
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  return session.user;
}