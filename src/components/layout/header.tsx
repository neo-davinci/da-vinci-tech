"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeModeToggle } from "@/components/themes/theme-mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/50 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Badge
          variant="outline"
          className="hidden text-xs text-muted-foreground sm:flex gap-1.5 border-border/50"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          tailnet-only
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <ThemeModeToggle />
        <Badge
          variant="outline"
          className="h-8 w-8 p-0 items-center justify-center border-border/50"
        >
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
        </Badge>
      </div>
    </header>
  );
}
