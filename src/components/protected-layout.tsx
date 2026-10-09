import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
export function ProtectedLayout({
  session,
  children,
}: {
  session: Session | null | undefined;
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "loading") {
    return <main className="dashboard-access-denied" role="status">Checking access…</main>;
  }

  if (!session || session.user.role !== "admin") {
    return (
      <main className="dashboard-access-denied">
        <h1>
          Admin access required
        </h1>
        <p>
          Sign in with an administrator account to manage the guestbook.
        </p>
        <Link href="/">Return to guestbook</Link>
      </main>
    );
  }

  return <>{children}</>;
}
