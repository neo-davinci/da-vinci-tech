import { execSync } from "child_process";

export interface Device {
  name: string;
  type: "desktop" | "mobile" | "server" | "other";
  os: string;
  ip: string;
  lastSeen: string;
  online: boolean;
}

export interface TailnetData {
  tailnetName: string;
  settings: { label: string; value: string }[];
  devices: Device[];
  checkedAt: string;
}

function exec(cmd: string): string {
  try {
    return execSync(cmd, { timeout: 5000, encoding: "utf-8" }) as string;
  } catch {
    return "";
  }
}

function getDeviceType(os: string): Device["type"] {
  const o = os.toLowerCase();
  if (o.includes("macos") || o.includes("darwin") || o.includes("windows") || o.includes("linux")) return "desktop";
  if (o.includes("ios") || o.includes("android")) return "mobile";
  if (o.includes("linux") && o.includes("server")) return "server";
  return "other";
}

export async function getTailnet(): Promise<TailnetData> {
  const now = new Date().toISOString();
  let devices: Device[] = [];
  const tailnetName = "neo-os";

  try {
    const out = exec("tailscale status --json 2>/dev/null");
    const data = JSON.parse(out);

    const self = data.Self || {};
    const peers = data.Peer || {};

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

    for (const [, peer] of Object.entries(peers) as [string, Record<string, unknown>][]) {
      const dns = (peer.DNSName as string || "").replace(".tail73bd0d.ts.net.", "");
      const lastSeenDate = peer.LastSeen ? new Date(peer.LastSeen as string) : null;
      const nowMs = Date.now();
      const elapsedMs = lastSeenDate ? nowMs - lastSeenDate.getTime() : 0;
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
        name: dns || (peer.ID as string)?.slice(0, 12) || "—",
        type: getDeviceType((peer.OS as string) || "unknown"),
        os: (peer.OS as string) || "Unknown",
        ip: ((peer.TailscaleIPs as string[]) || [])[0] || "—",
        lastSeen: lastSeenStr,
        online: !!peer.Online,
      });
    }
  } catch {
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

  return { tailnetName, settings, devices, checkedAt: now };
}
