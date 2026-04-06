"use client";

import { useMemo } from "react";
import type { NavItem, NavGroup } from "@/types/nav";

/**
 * Hook to filter navigation groups — no RBAC (tailnet-only access)
 * All items are visible since access is controlled at the network level.
 */
export function useFilteredNavGroups(groups: NavGroup[]) {
  return useMemo(() => groups.filter((g) => g.items.length > 0), [groups]);
}

export function useFilteredNavItems(items: NavItem[]) {
  return useMemo(() => items, [items]);
}
