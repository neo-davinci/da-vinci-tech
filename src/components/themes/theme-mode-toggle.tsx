"use client";

import { Icons } from "@/components/icons";
import { useTheme } from "next-themes";
import { useCallback } from "react";

export function ThemeModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const handleToggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Icons.sun className="h-4 w-4" />
      ) : (
        <Icons.moon className="h-4 w-4" />
      )}
    </button>
  );
}
