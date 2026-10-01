import { Button } from "@heroui/react";
import type { ColorTheme } from "@/hooks/use-color-theme";

export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: ColorTheme;
  onToggle: () => void;
}) {
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      aria-label={`Switch to ${nextTheme} mode`}
      onPress={onToggle}
      size="sm"
      variant="tertiary"
    >
      {nextTheme === "light" ? "Light mode" : "Dark mode"}
    </Button>
  );
}
