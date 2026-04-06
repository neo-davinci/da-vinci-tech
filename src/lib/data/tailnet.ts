import { getTailnet } from "@/lib/tailnet";

export type { TailnetData } from "@/lib/tailnet";

export async function fetchTailnet() {
  return getTailnet();
}
