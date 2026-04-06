import { TailnetResponse } from "@/app/api/tailnet/route";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function fetchTailnet(): Promise<TailnetResponse> {
  const res = await fetch(`${BASE_URL}/api/tailnet`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Tailnet fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<TailnetResponse>;
}
