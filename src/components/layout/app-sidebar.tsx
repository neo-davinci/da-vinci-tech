"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/components/icons";
import { navGroups } from "@/config/nav-config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const LogoIcon = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
      <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M8 5L11 7V11L8 13L5 11V7L8 5Z" fill="currentColor" opacity="0.5"/>
    </svg>
  </div>
);

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="group-data-[collapsible=icon]:pt-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <LogoIcon />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">Neo OS</span>
            <span className="text-xs text-muted-foreground">Control Room</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label || "ungrouped"} className="py-0">
            {group.label && (
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-2">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = getIcon(item.icon as string);
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/dashboard" && pathname.startsWith(item.url));
                const hasChildren = item.items && item.items.length > 0;

                return hasChildren ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isActive}
                          className={cn(
                            "w-full",
                            isActive && "bg-primary/10 text-primary"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                          <svg
                            className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M6 4l4 4-4 4" />
                          </svg>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((sub) => {
                            const SubIcon = sub.icon ? getIcon(sub.icon as string) : null;
                            return (
                              <SidebarMenuSubItem key={sub.title}>
                                <Link
                                  href={sub.url}
                                  target={sub.url.startsWith("http") ? "_blank" : undefined}
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground text-sm data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden",
                                    pathname === sub.url && "bg-sidebar-accent text-sidebar-accent-foreground"
                                  )}
                                >
                                  {SubIcon && <SubIcon className="h-4 w-4 shrink-0" />}
                                  <span className="truncate">{sub.title}</span>
                                </Link>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        "transition-colors",
                        isActive && "bg-primary/10 text-primary"
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 w-full h-full"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <Separator className="my-2" />
        <div className="px-3 py-2">
          <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
            tailnet-only access
          </Badge>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
