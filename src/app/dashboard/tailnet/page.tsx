import { fetchTailnet } from "@/lib/data/tailnet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/ui/hero-section";
import { Separator } from "@/components/ui/separator";
import { Globe, Lock, Monitor, Smartphone, Users, type LucideIcon } from "lucide-react";

function getDeviceIcon(type: string): LucideIcon {
  if (type === "mobile") return Smartphone;
  if (type === "server") return Globe;
  return Monitor;
}

export default async function TailnetPage() {
  const data = await fetchTailnet();

  const onlineCount = data.devices.filter((d) => d.online).length;

  return (
    <div className="relative flex-1 overflow-hidden">
      <HeroSection
        iconName="globe"
        label="Network"
        title="Tailnet"
        description={`${data.devices.length} registered · ${onlineCount} online`}
      >
        <Badge
          variant="outline"
          className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs"
        >
          <Lock className="h-3 w-3" />
          Tailnet Lock Active
        </Badge>
      </HeroSection>

      <div className="px-6 py-6 space-y-6">
        {/* Settings */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tailnet Settings</CardTitle>
            <CardDescription className="text-xs">{data.tailnetName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {data.settings.map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-xs">{item.value}</span>
                </div>
                {i < data.settings.length - 1 && <Separator className="bg-border/30" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Devices */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
            </div>
            <CardDescription className="text-xs">{data.devices.length} nodes · {onlineCount} online</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.devices.map((device) => {
              const Icon = getDeviceIcon(device.type);
              return (
                <div
                  key={device.name}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {device.os} · {device.ip}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{device.lastSeen}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs font-normal ${
                        device.online
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                          : "border-border/50 text-muted-foreground"
                      }`}
                    >
                      {device.online ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
