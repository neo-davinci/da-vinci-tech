import { ActivityResponse } from "@/app/api/activity/route";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function fetchActivity(): Promise<ActivityResponse> {
  const res = await fetch(`${BASE_URL}/api/activity`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Activity fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ActivityResponse>;
}
