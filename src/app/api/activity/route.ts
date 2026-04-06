import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface ActivityItem {
  time: string;
  category: string;
  event: string;
  status: "success" | "warning" | "error";
  agent: string;
}

export interface ActivityResponse {
  events: ActivityItem[];
  checkedAt: string;
}

async function exec(cmd: string): Promise<string> {
  const { execSync: exec } = await import("child_process");
  return exec(cmd, { timeout: 5000, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] } as any) as string;
}

function parseCategory(line: string): string {
  if (line.includes("Telegram")) return "Telegram";
  if (line.includes("MCP")) return "MCP";
  if (line.includes("cron") || line.includes("Cron")) return "Cron";
  if (line.includes("health") || line.includes("uptime")) return "Health";
  if (line.includes("model") || line.includes("Model")) return "Model";
  if (line.includes("gateway")) return "Core";
  if (line.includes("dangerous")) return "Auth";
  return "System";
}

export async function GET() {
  const now = new Date().toISOString();
  const events: ActivityItem[] = [];

  // ── Gateway log entries ──────────────────────────────────────────────────
  try {
    const logOut = await exec(
      "tail -100 ~/.hermes/logs/gateway.log 2>/dev/null | grep -E 'INFO|ERROR|WARN' | grep -v 'INFO gateway.run:.*tool{' | tail -15"
    );

    for (const line of logOut.split("\n").filter(Boolean)) {
      const tsMatch = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
      const isError = line.includes("ERROR");
      const isWarning = line.includes("WARN");

      let event = line.replace(/^\S+ \S+ \S+ \S+ /, "").trim();

      // Normalize event descriptions
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
        event = "Telegram batch flushed";
      }

      const timeStr = tsMatch
        ? new Date(tsMatch[1]).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "—";

      events.push({
        time: timeStr,
        category: parseCategory(line),
        event,
        status: isError ? "error" : isWarning ? "warning" : "success",
        agent: "Hermes",
      });
    }
  } catch { /* keep empty */ }

  // ── Recent cron brief files ───────────────────────────────────────────────
  try {
    const cronDirs = await exec(
      "ls -t ~/.hermes/cron/output/ 2>/dev/null | head -3"
    ).then((out) => out.trim().split("\n"));

    for (const dir of cronDirs) {
      if (!dir) continue;
      const files = await exec(
        `ls -t ~/.hermes/cron/output/${dir}/ 2>/dev/null | head -1`
      ).then((out) => out.trim().split("\n"));

      for (const file of files) {
        if (!file || !file.endsWith(".md")) continue;
        const content = await exec(`head -5 ~/.hermes/cron/output/${dir}/${file} 2>/dev/null`);
        const tsMatch = file.match(/(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})-(\d{2})/);
        if (tsMatch) {
          const [, date, h, m] = tsMatch;
          const timeStr = new Date(`${date}T${h}:${m}:00`).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const isMCP = content.includes("MCP") || content.includes("Mcp");
          const isModel = content.includes("model") || content.includes("Model");
          const isBrief = content.includes("Brief") || content.includes("brief");

          events.push({
            time: timeStr,
            category: isMCP ? "MCP" : isModel ? "Model" : isBrief ? "Brief" : "Cron",
            event: `Cron job completed: ${file.replace(".md", "").replace(/^\d{4}-\d{2}-\d{2}_/, "")}`,
            status: "success",
            agent: "Claw Daemon",
          });
        }
      }
    }
  } catch { /* keep empty */ }

  // Sort by time desc and dedupe
  const sorted = events
    .sort((a, b) => (a.time < b.time ? 1 : -1))
    .slice(0, 20);

  return NextResponse.json({ events: sorted, checkedAt: now } as ActivityResponse, {
    headers: { "Cache-Control": "no-store" },
  });
}
