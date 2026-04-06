import { StatsResponse } from "@/app/api/stats/route";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export type DashboardStats = {
  systemStatus: string;
  tailnetNodes: number;
  tailnetNodeDetail: string;
  apiHealth: string;
  apiHealthDescription: string;
  cronJobs: string;
  cronJobsDescription: string;
  ramUsedGB: string;
  ramTotalGB: string;
  diskUsedGB: string;
  diskTotalGB: string;
  uptime: string;
  cpuModel: string;
  deployUrl: string;
  recentActivity: StatsResponse["recentActivity"];
  checkedAt: string;
};

export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/api/stats`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Stats fetch failed: ${res.status} ${res.statusText}`);
  }

  const data: StatsResponse = await res.json();

  // Parse the raw stats array into structured fields
  const byTitle = Object.fromEntries(data.stats.map((s) => [s.title, s]));

  return {
    systemStatus: "nominal",
    tailnetNodes: 2,
    tailnetNodeDetail: "srv1332923 + MacBook",
    apiHealth: byTitle["Deploy"]?.value ?? "Live",
    apiHealthDescription: byTitle["Deploy"]?.description ?? "",
    cronJobs: "2 active",
    cronJobsDescription: "Morning + Evening brief",
    ramUsedGB: byTitle["RAM Usage"]?.value ?? "—",
    ramTotalGB: byTitle["RAM Usage"]?.description?.match(/of ([\d.]+ GB)/)?.[1] ?? "—",
    diskUsedGB: byTitle["Disk Usage"]?.value ?? "—",
    diskTotalGB: byTitle["Disk Usage"]?.description?.match(/of ([\d.]+ GB)/)?.[1] ?? "—",
    uptime: byTitle["VPS Uptime"]?.value ?? "—",
    cpuModel: byTitle["VPS Uptime"]?.description ?? "—",
    deployUrl: byTitle["Deploy"]?.description ?? "",
    recentActivity: data.recentActivity,
    checkedAt: data.checkedAt,
  };
}
