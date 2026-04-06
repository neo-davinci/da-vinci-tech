import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface Device {
  name: string;
  type: "desktop" | "mobile" | "server" | "other";
  os: string;
  ip: string;
  lastSeen: string;
  online: boolean;
}

export interface TailnetResponse {
  tailnetName: string;
  settings: { label: string; value: string }[];
  devices: Device[];
  checkedAt: string;
}

async function exec(cmd: string): Promise<string> {
  const { execSync: exec } = await import("child_process");
  return exec(cmd, { timeout: 5000, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] } as any) as string;
}

function getDeviceType(os: string): Device["type"] {
  const o = os.toLowerCase();
  if (o.includes("macos") || o.includes("darwin") || o.includes("windows") || o.includes("linux")) return "desktop";
  if (o.includes("ios") || o.includes("android")) return "mobile";
  if (o.includes("linux") && o.includes("server")) return "server";
  return "other";
}

export async function GET() {
  const now = new Date().toISOString();
  let devices: Device[] = [];
  let tailnetName = "neo-os";

  try {
    const out = await exec("tailscale status --json 2>/dev/null");
    const data = JSON.parse(out);

    const self = data.Self || {};
    const peers = data.Peer || {};

    // Self node
    const selfDNS = (self.DNSName || "").replace(".tail73bd0d.ts.net.", "");
    if (selfDNS) {
      devices.push({
        name: selfDNS || "This node",
        type: getDeviceType(self.OS || "linux"),
        os: self.OS || "Linux",
        ip: self.TailscaleIPs?.[0] || "—",
        lastSeen: "Active now",
        online: true,
      });
    }

    // Peer nodes
    for (const [key, peer] of Object.entries(peers) as [string, any][]) {
      const dns = (peer.DNSName || "").replace(".tail73bd0d.ts.net.", "");
      const lastSeenDate = peer.LastSeen ? new Date(peer.LastSeen) : null;
      const now = new Date();
      const elapsedMs = lastSeenDate ? now.getTime() - lastSeenDate.getTime() : 0;
      const elapsedMin = Math.floor(elapsedMs / 60000);

      let lastSeenStr = "Unknown";
      if (peer.Online) {
        lastSeenStr = "Active now";
      } else if (lastSeenDate) {
        if (elapsedMin < 60) lastSeenStr = `${elapsedMin}m ago`;
        else if (elapsedMin < 1440) lastSeenStr = `${Math.floor(elapsedMin / 60)}h ago`;
        else lastSeenStr = `${Math.floor(elapsedMin / 1440)}d ago`;
      }

      devices.push({
        name: dns || key.slice(0, 12),
        type: getDeviceType(peer.OS || "unknown"),
        os: peer.OS || "Unknown",
        ip: peer.TailscaleIPs?.[0] || "—",
        lastSeen: lastSeenStr,
        online: !!peer.Online,
      });
    }
  } catch (e) {
    // If tailscale not available, return empty
    devices = [];
  }

  const onlineCount = devices.filter((d) => d.online).length;

  const settings = [
    { label: "Tailnet name", value: tailnetName },
    { label: "Nodes", value: `${devices.length} registered` },
    { label: "Online now", value: `${onlineCount} active` },
    { label: "ACL policy", value: "Tailnet lock" },
    { label: "MagicDNS", value: "Enabled" },
    { label: "HTTPS", value: "Enabled" },
    { label: "SSH keys", value: "Configured" },
  ];

  const data: TailnetResponse = { tailnetName, settings, devices, checkedAt: now };

  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
