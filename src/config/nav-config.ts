import { NavGroup } from "@/types/nav";

export const navGroups: NavGroup[] = [
  {
    label: "Control Room",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: "dashboard",
        isActive: true,
        shortcut: ["o", "o"],
      },
      {
        title: "Health",
        url: "/dashboard/health",
        icon: "activity",
        shortcut: ["h", "h"],
      },
      {
        title: "Tailnet",
        url: "/dashboard/tailnet",
        icon: "network",
        shortcut: ["n", "n"],
      },
      {
        title: "Activity",
        url: "/dashboard/activity",
        icon: "server",
        shortcut: ["a", "a"],
      },
    ],
  },
  {
    label: "Growth Engine",
    items: [
      {
        title: "Picks",
        url: "#",
        icon: "zap",
        shortcut: ["p", "p"],
        items: [
          {
            title: "Live Picks",
            url: "https://picks.davincibets.io",
            icon: "zap",
          },
          {
            title: "Analytics",
            url: "https://davincibets.io/analytics",
            icon: "trendingUp",
          },
        ],
      },
      {
        title: "Orchestrator",
        url: "#",
        icon: "cpu",
        items: [
          {
            title: "Logs",
            url: "/dashboard/orchestrator",
            icon: "server",
          },
        ],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: "settings",
        shortcut: ["s", "s"],
      },
    ],
  },
];
