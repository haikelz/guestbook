import { ThemeToggle } from "@/components/theme-toggle";
import { useColorTheme } from "@/hooks/use-color-theme";
import { Button } from "@heroui/react";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  const { theme, toggleTheme } = useColorTheme();

  return (
    <main className="guestbook-error-page">
      <div className="guestbook-error-theme">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      <div className="guestbook-error-content">
        <div className="error-code">404</div>
        <h1>This page isn't here.</h1>
        <p>The link may have changed. Head back to the guestbook to join the conversation.</p>
        <Button
          className="mt-4"
          onPress={function handleGoBack() {
            void router.push("/");
          }}
          variant="secondary"
        >
          Return to guestbook
        </Button>
      </div>
    </main>
  );
}
