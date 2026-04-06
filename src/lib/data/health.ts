import { HealthResponse } from "@/app/api/health/route";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function fetchHealth(): Promise<HealthResponse> {
  // In a server component, direct imports or internal API calls work.
  // For now we call the route handler via absolute URL to keep the
  // fetch interface consistent for future real backends.
  const res = await fetch(`${BASE_URL}/api/health`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<HealthResponse>;
}
