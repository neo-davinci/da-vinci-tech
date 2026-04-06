import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface HealthComponent {
  name: string;
  status: "operational" | "degraded" | "offline";
  latency: string;
  category: "Core" | "Integrations" | "Infrastructure";
}

export interface HealthResponse {
  status: "nominal" | "degraded" | "down";
  uptime: string;
  checkedAt: string;
  components: HealthComponent[];
}

async function exec(cmd: string): Promise<string> {
  const { execSync: exec } = await import("child_process");
  return exec(cmd, { timeout: 5000, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] } as any) as string;
}

async function checkComponent(
  name: string,
  category: "Core" | "Integrations" | "Infrastructure",
  checkFn: () => Promise<{ status: "operational" | "degraded" | "offline"; latency: string }>
): Promise<HealthComponent> {
  try {
    const result = await checkFn();
    return { name, status: result.status, latency: result.latency, category };
  } catch {
    return { name, status: "offline", latency: "—", category };
  }
}

async function pingHost(host: string): Promise<{ status: "operational" | "degraded" | "offline"; latency: string }> {
  try {
    const out = await exec(`ping -c 1 -W 2 ${host} 2>&1 | grep time=`);
    const match = out.match(/time=([\d.]+)/);
    if (!match) return { status: "degraded", latency: "—" };
    const ms = parseFloat(match[1]);
    return { status: ms < 100 ? "operational" : "degraded", latency: `${ms.toFixed(0)}ms` };
  } catch {
    return { status: "offline", latency: "—" };
  }
}

async function checkOpenRouter(): Promise<{ status: "operational" | "degraded" | "offline"; latency: string }> {
  const start = Date.now();
  try {
    const { execSync: exec } = await import("child_process");
    exec("curl -s --max-time 3 https://openrouter.ai/api/v1/models 2>&1 > /dev/null && echo ok", {
      timeout: 5000, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"],
    } as any);
    return { status: "operational", latency: `${Date.now() - start}ms` };
  } catch {
    return { status: "offline", latency: "—" };
  }
}

async function checkTailscale(): Promise<{ status: "operational" | "degraded" | "offline"; latency: string }> {
  try {
    const out = await exec("tailscale status --json 2>/dev/null | python3 -c 'import json,sys; d=json.load(sys.stdin); print(len(d.get(\"Peer\",{})), d.get(\"Self\",{}).get(\"Online\",False))'");
    const [peerCount, online] = out.trim().split(" ");
    return {
      status: online === "True" ? "operational" : "degraded",
      latency: `${peerCount} nodes`,
    };
  } catch {
    return { status: "offline", latency: "—" };
  }
}

async function checkHermes(): Promise<{ status: "operational" | "degraded" | "offline"; latency: string }> {
  try {
    // Check if Hermes gateway process is alive
    const out = await exec("pgrep -f 'gateway' | head -1");
    const pid = out.trim();
    if (pid) {
      return { status: "operational", latency: `pid ${pid}` };
    }
    return { status: "offline", latency: "—" };
  } catch {
    return { status: "offline", latency: "—" };
  }
}

async function checkClaw(): Promise<{ status: "operational" | "degraded" | "offline"; latency: string }> {
  try {
    const out = await exec("ls ~/.hermes/cron/output/ 2>/dev/null | wc -l");
    const count = parseInt(out.trim() || "0");
    return { status: "operational", latency: `${count} runs` };
  } catch {
    return { status: "offline", latency: "—" };
  }
}

async function checkObsidian(): Promise<{ status: "operational" | "degraded" | "offline"; latency: string }> {
  try {
    const out = await exec("ls /home/leo/neo-obsidian/ 2>/dev/null | wc -l");
    const count = parseInt(out.trim() || "0");
    return { status: count > 0 ? "operational" : "degraded", latency: `${count} entries` };
  } catch {
    return { status: "offline", latency: "—" };
  }
}

export async function GET() {
  const now = new Date().toISOString();

  // VPS uptime
  let uptime = "—";
  try {
    const uptimeRaw = await exec("cat /proc/uptime");
    const elapsedSec = parseFloat(uptimeRaw.split(" ")[0]);
    const days = Math.floor(elapsedSec / 86400);
    const hours = Math.floor((elapsedSec % 86400) / 3600);
    uptime = days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  } catch { /* keep default */ }

  // Run all checks in parallel
  const [ts, hermes, claw, obsidian, openrouter] = await Promise.all([
    checkComponent("Tailscale", "Core", checkTailscale),
    checkComponent("Hermes Agent", "Core", checkHermes),
    checkComponent("Claw Orchestration", "Core", checkClaw),
    checkComponent("Neo Obsidian Vault", "Infrastructure", checkObsidian),
    checkComponent("OpenRouter", "Integrations", checkOpenRouter),
  ]);

  // Static components
  const staticComponents: HealthComponent[] = [
    { name: "VPS Server", status: "operational", latency: "local", category: "Infrastructure" },
    { name: "Cron Scheduler", status: claw.status, latency: claw.latency, category: "Infrastructure" },
    { name: "Model Routing", status: "operational", latency: "local", category: "Infrastructure" },
    { name: "Telegram", status: "operational", latency: "connected", category: "Integrations" },
    { name: "GitHub MCP", status: "operational", latency: "configured", category: "Integrations" },
    { name: "Da Vinci Bets MCP", status: "operational", latency: "configured", category: "Integrations" },
  ];

  const components = [ts, hermes, claw, obsidian, openrouter, ...staticComponents];

  const downCount = components.filter((c) => c.status === "offline").length;
  const degradedCount = components.filter((c) => c.status === "degraded").length;
  const overallStatus: "nominal" | "degraded" | "down" =
    downCount > 0 ? "down" : degradedCount > 0 ? "degraded" : "nominal";

  const data: HealthResponse = { status: overallStatus, uptime, checkedAt: now, components };

  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
