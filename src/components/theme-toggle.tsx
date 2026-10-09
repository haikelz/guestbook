import { Button } from "@heroui/react";
import type { ColorTheme } from "@/hooks/use-color-theme";
import { LuMoon, LuSun } from "react-icons/lu";

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
      isIconOnly
    >
      {nextTheme === "light" ? <LuSun aria-hidden="true" /> : <LuMoon aria-hidden="true" />}
    </Button>
  );
}
