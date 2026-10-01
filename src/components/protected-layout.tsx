import { atom, useAtom } from "jotai";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const secondsAtom = atom<number>(5);

/**
 * ProtectedLayout is a component that wraps the children components and checks if the user is authorized to access the page.
 * If the user is not authorized, it will redirect to the home page after 5 seconds.
 * @param session - The session object.
 * @param children - The children components.
 * @returns The ProtectedLayout component.
 */
export function ProtectedLayout({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const router = useRouter();

  if (!session || session.user.role !== "admin") {
    const [seconds, setSeconds] = useAtom(secondsAtom);

    useEffect(() => {
      const interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    }, [seconds]);

    setTimeout(() => {
      router.push("/");
    }, 5000);

    return (
      <main className="dashboard-access-denied">
        <h1>
          You are not authorized to access this page!
        </h1>
        <p>
          You will be redirected to the home page in {seconds} seconds.
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
