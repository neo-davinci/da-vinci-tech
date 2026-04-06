import { execSync } from "child_process";

export interface HealthComponent {
  name: string;
  status: "operational" | "degraded" | "offline";
  latency: string;
  category: "Core" | "Integrations" | "Infrastructure";
}

export interface HealthData {
  status: "nominal" | "degraded" | "down";
  uptime: string;
  checkedAt: string;
  components: HealthComponent[];
}

function exec(cmd: string): string {
  try {
    return execSync(cmd, { timeout: 5000, encoding: "utf-8" }) as string;
  } catch {
    return "";
  }
}

async function checkComponent(
  name: string,
  category: "Core" | "Integrations" | "Infrastructure",
  checkFn: () => { status: "operational" | "degraded" | "offline"; latency: string }
): Promise<HealthComponent> {
  try {
    const result = checkFn();
    return { name, status: result.status, latency: result.latency, category };
  } catch {
    return { name, status: "offline", latency: "—", category };
  }
}

function checkTailscale(): { status: "operational" | "degraded" | "offline"; latency: string } {
  try {
    const out = exec("tailscale status --json 2>/dev/null | python3 -c 'import json,sys; d=json.load(sys.stdin); print(len(d.get(\"Peer\",{})), d.get(\"Self\",{}).get(\"Online\",False))'");
    const [peerCount, online] = out.trim().split(" ");
    return { status: online === "True" ? "operational" : "degraded", latency: `${peerCount} nodes` };
  } catch {
    return { status: "offline", latency: "—" };
  }
}

function checkHermes(): { status: "operational" | "degraded" | "offline"; latency: string } {
  try {
    const out = exec("pgrep -f 'gateway' | head -1");
    const pid = out.trim();
    if (pid) return { status: "operational", latency: `pid ${pid}` };
    return { status: "offline", latency: "—" };
  } catch {
    return { status: "offline", latency: "—" };
  }
}

function checkClaw(): { status: "operational" | "degraded" | "offline"; latency: string } {
  try {
    const out = exec("ls ~/.hermes/cron/output/ 2>/dev/null | wc -l");
    const count = parseInt(out.trim() || "0");
    return { status: "operational", latency: `${count} runs` };
  } catch {
    return { status: "offline", latency: "—" };
  }
}

function checkObsidian(): { status: "operational" | "degraded" | "offline"; latency: string } {
  try {
    const out = exec("ls /home/leo/neo-obsidian/ 2>/dev/null | wc -l");
    const count = parseInt(out.trim() || "0");
    return { status: count > 0 ? "operational" : "degraded", latency: `${count} entries` };
  } catch {
    return { status: "offline", latency: "—" };
  }
}

export async function getHealth(): Promise<HealthData> {
  const now = new Date().toISOString();

  let uptime = "—";
  try {
    const uptimeRaw = exec("cat /proc/uptime");
    const elapsedSec = parseFloat(uptimeRaw.split(" ")[0]);
    const days = Math.floor(elapsedSec / 86400);
    const hours = Math.floor((elapsedSec % 86400) / 3600);
    uptime = days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  } catch { /* keep default */ }

  const [ts, hermes, claw, obsidian] = await Promise.all([
    checkComponent("Tailscale", "Core", checkTailscale),
    checkComponent("Hermes Agent", "Core", checkHermes),
    checkComponent("Claw Orchestration", "Core", checkClaw),
    checkComponent("Neo Obsidian Vault", "Infrastructure", checkObsidian),
  ]);

  const staticComponents: HealthComponent[] = [
    { name: "VPS Server", status: "operational", latency: "local", category: "Infrastructure" },
    { name: "Cron Scheduler", status: claw.status, latency: claw.latency, category: "Infrastructure" },
    { name: "Model Routing", status: "operational", latency: "local", category: "Infrastructure" },
    { name: "Telegram", status: "operational", latency: "connected", category: "Integrations" },
    { name: "GitHub MCP", status: "operational", latency: "configured", category: "Integrations" },
    { name: "Da Vinci Bets MCP", status: "operational", latency: "configured", category: "Integrations" },
  ];

  const components = [ts, hermes, claw, obsidian, ...staticComponents];
  const downCount = components.filter((c) => c.status === "offline").length;
  const degradedCount = components.filter((c) => c.status === "degraded").length;
  const overallStatus: "nominal" | "degraded" | "down" =
    downCount > 0 ? "down" : degradedCount > 0 ? "degraded" : "nominal";

  return { status: overallStatus, uptime, checkedAt: now, components };
}
