import { useEffect, useState } from "react";

export type ColorTheme = "light" | "dark";

export function useColorTheme() {
  const [theme, setTheme] = useState<ColorTheme>("dark");
  const [isReady, setIsReady] = useState(false);

  useEffect(function restoreTheme() {
    const savedTheme = window.localStorage.getItem("guestbook-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
    setIsReady(true);
  }, []);

  useEffect(
    function applyTheme() {
      document.documentElement.dataset.theme = theme;
      if (isReady) {
        window.localStorage.setItem("guestbook-theme", theme);
      }
    },
    [isReady, theme],
  );

  function toggleTheme() {
    setTheme(function getNextTheme(currentTheme) {
      return currentTheme === "dark" ? "light" : "dark";
    });
  }

  return { theme, toggleTheme };
}
