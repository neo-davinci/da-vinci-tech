import { execSync } from "child_process";

export interface StatItem {
  title: string;
  value: string;
  icon: string;
  description: string;
}

export interface ActivityItem {
  time: string;
  event: string;
  status: "success" | "warning" | "error";
  agent: string;
}

export interface StatsData {
  stats: StatItem[];
  recentActivity: ActivityItem[];
  checkedAt: string;
}

function exec(cmd: string): string {
  try {
    return execSync(cmd, { timeout: 5000, encoding: "utf-8" }) as string;
  } catch {
    return "";
  }
}

export async function getStats(): Promise<StatsData> {
  const now = new Date();
  const checkedAt = now.toISOString();

  let uptime = "—";
  let cpuModel = "—";
  let ramUsedGB = "—";
  let ramTotalGB = "—";
  let diskUsedGB = "—";
  let diskTotalGB = "—";

  try {
    const uptimeRaw = exec("cat /proc/uptime");
    const elapsedSec = parseFloat(uptimeRaw.split(" ")[0]);
    const days = Math.floor(elapsedSec / 86400);
    const hours = Math.floor((elapsedSec % 86400) / 3600);
    uptime = days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  } catch { /* keep default */ }

  try {
    cpuModel = exec("cat /proc/cpuinfo | grep 'model name' | head -1 | cut -d: -f2 | xargs").trim() || "—";
  } catch { /* keep default */ }

  try {
    const freeOut = exec("free -b | awk 'NR==2{print $3,$2}'");
    const [used, total] = freeOut.trim().split(" ").map(Number);
    ramUsedGB = (used / 1e9).toFixed(1);
    ramTotalGB = (total / 1e9).toFixed(1);
  } catch { /* keep default */ }

  try {
    const dfOut = exec("df -BG / | awk 'NR==2{print $3,$4}'");
    const [used, total] = dfOut.trim().replace(/G/g, "").split(" ");
    diskUsedGB = used.replace(/G/, "");
    diskTotalGB = total.replace(/G/, "");
  } catch { /* keep default */ }

  let recentActivity: ActivityItem[] = [];
  try {
    const logOut = exec(
      "tail -60 ~/.hermes/logs/gateway.log 2>/dev/null | grep -E 'INFO|ERROR|WARN' | grep -v 'INFO gateway.run:.*tool' | tail -8"
    );
    recentActivity = parseActivityLog(logOut, now);
  } catch { /* keep default */ }

  const stats: StatItem[] = [
    { title: "VPS Uptime", value: uptime, icon: "activity", description: cpuModel || "AMD EPYC" },
    { title: "RAM Usage", value: `${ramUsedGB} GB`, icon: "cpu", description: `${ramUsedGB} GB used of ${ramTotalGB} GB` },
    { title: "Disk Usage", value: `${diskUsedGB} GB`, icon: "hard-drive", description: `${diskUsedGB} GB used of ${diskTotalGB} GB` },
    { title: "Deploy", value: "Live", icon: "zap", description: "control-room-kohl.vercel.app" },
  ];

  return { stats, recentActivity, checkedAt };
}

function parseActivityLog(logOut: string, now: Date): ActivityItem[] {
  const lines = logOut.split("\n").filter(Boolean);
  const items: ActivityItem[] = [];

  for (const line of lines) {
    const tsMatch = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
    const isError = line.includes("ERROR");
    const isWarning = line.includes("WARN");

    let event = line.replace(/^\S+ \S+ \S+ \S+ /, "").trim();
    if (event.includes("Flushing text batch")) {
      const m = event.match(/\( (\d+) chars \)/);
      event = `Telegram delivery${m ? ` (${m[1]} chars)` : ""}`;
    } else if (event.includes("Sending response")) {
      event = "Telegram response sent";
    } else if (event.includes("dangerous command")) {
      event = "User approved dangerous command";
    } else if (event.includes("timed out")) {
      event = "Agent execution timeout";
    } else if (event.includes("MCP tool")) {
      event = "MCP tool call error";
    } else if (event.includes("Flushing text")) {
      event = "Telegram text flushed";
    }

    let timeStr = "—";
    if (tsMatch) {
      const t = new Date(tsMatch[1]);
      timeStr = t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    }

    items.push({ time: timeStr, event, status: isError ? "error" : isWarning ? "warning" : "success", agent: "Hermes" });
  }

  return items.slice(0, 8);
}
