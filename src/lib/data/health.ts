import { getHealth } from "@/lib/health";

export type { HealthData } from "@/lib/health";

export async function fetchHealth() {
  return getHealth();
}
