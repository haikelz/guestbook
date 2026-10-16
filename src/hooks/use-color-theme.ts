import { useEffect, useState } from "react";

export type ColorTheme = "light" | "dark";

export function useColorTheme() {
  const [theme, setTheme] = useState<ColorTheme>("dark");
  const [isReady, setIsReady] = useState(false);

  useEffect(function restoreTheme() {
    const savedTheme = window.localStorage.getItem("guestbook-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    setIsReady(true);
  }, []);

  useEffect(
    function applyTheme() {
      // Until restore runs, keep the theme _document's inline script already applied.
      if (!isReady) return;
      document.documentElement.dataset.theme = theme;
      window.localStorage.setItem("guestbook-theme", theme);
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
