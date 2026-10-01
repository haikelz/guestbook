import FuzzyText from "@/components/react-bits/fuzzy-text";
import { ThemeToggle } from "@/components/theme-toggle";
import { useColorTheme } from "@/hooks/use-color-theme";
import { Button } from "@heroui/react";
import { useRouter } from "next/router";

export default function Custom500() {
  const router = useRouter();
  const { theme, toggleTheme } = useColorTheme();

  return (
    <main className="guestbook-error-page">
      <div className="guestbook-error-theme">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      <div className="guestbook-error-content">
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover={true}
          fontSize="2rem"
        >
          500 Internal Server Error
        </FuzzyText>
        <Button
          className="mt-4"
          onPress={function handleGoBack() {
            router.back();
          }}
          variant="secondary"
        >
          Back to previous page
        </Button>
      </div>
    </main>
  );
}
