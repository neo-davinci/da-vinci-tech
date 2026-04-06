"use client";

import { navGroups } from "@/config/nav-config";
import { KBarPortal, KBarPositioner, KBarAnimator, KBarSearch, KBarProvider } from "kbar";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import RenderResults from "./render-result";

export default function KBarWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const actions = useMemo(() => {
    const navigateTo = (url: string) => router.push(url);

    return navGroups.flatMap((group) =>
      group.items.flatMap((item) => {
        const baseAction = item.url !== "#"
          ? {
              id: `${item.title.toLowerCase().replace(/\s+/g, "-")}-action`,
              name: item.title,
              shortcut: item.shortcut,
              keywords: item.title.toLowerCase(),
              section: group.label || "Navigation",
              perform: () => navigateTo(item.url),
            }
          : null;

        const childActions =
          item.items?.map((child) => ({
            id: `${child.title.toLowerCase().replace(/\s+/g, "-")}-action`,
            name: child.title,
            keywords: child.title.toLowerCase(),
            section: item.title,
            perform: () => navigateTo(child.url),
          })) ?? [];

        return baseAction ? [baseAction, ...childActions] : childActions;
      })
    );
  }, [router]);

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="bg-background/80 fixed inset-0 z-[99999] p-0 backdrop-blur-sm">
          <KBarAnimator className="bg-card text-card-foreground relative mt-64 w-full max-w-[600px] -translate-y-12 overflow-hidden rounded-xl border shadow-2xl">
            <div className="bg-card border-border sticky top-0 z-10 border-b px-4 py-3">
              <KBarSearch className="bg-card w-full border-none px-3 py-2 text-base outline-none ring-0 focus:ring-0" />
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}
