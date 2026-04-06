import { fetchActivity } from "@/lib/data/activity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeroSection } from "@/components/ui/hero-section";
import {
  Activity,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  Shield,
  Zap,
} from "lucide-react";

const categoryColors: Record<string, string> = {
  Telegram: "border-blue-500/30 bg-blue-500/10 text-blue-500",
  Brief: "border-blue-500/30 bg-blue-500/10 text-blue-500",
  Learning: "border-purple-500/30 bg-purple-500/10 text-purple-500",
  Cron: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  Scan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-500",
  Health: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
  MCP: "border-orange-500/30 bg-orange-500/10 text-orange-500",
  Model: "border-pink-500/30 bg-pink-500/10 text-pink-500",
  Core: "border-slate-500/30 bg-slate-500/10 text-slate-400",
  Auth: "border-red-500/30 bg-red-500/10 text-red-500",
  System: "border-slate-500/30 bg-slate-500/10 text-slate-400",
};

const agentIcons: Record<string, React.ElementType> = {
  Hermes: Bot,
  "Claw Daemon": Cpu,
  Claw: Zap,
  System: Activity,
};

function getStatusIcon(status: string) {
  if (status === "error") return Zap;
  if (status === "warning") return Activity;
  return CheckCircle2;
}

export default async function ActivityPage() {
  const data = await fetchActivity();
  const { events } = data;

  const successCount = events.filter((e) => e.status === "success").length;

  return (
    <div className="relative flex-1 overflow-hidden">
      <HeroSection
        iconName="clock"
        label="Timeline"
        title="Activity"
        description={`${events.length} events · Last updated ${new Date(data.checkedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`}
      >
        <Badge
          variant="outline"
          className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs"
        >
          <CheckCircle2 className="h-3 w-3" />
          {successCount}/{events.length} successful
        </Badge>
      </HeroSection>

      <div className="px-6 py-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Event Log</CardTitle>
            <CardDescription className="text-xs">Chronological activity feed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {events.map((item, i) => {
              const AgentIcon = agentIcons[item.agent] || Bot;
              const StatusIcon = getStatusIcon(item.status);
              const statusColor = item.status === "error"
                ? "text-red-500"
                : item.status === "warning"
                ? "text-amber-500"
                : "text-emerald-500";

              return (
                <div key={i}>
                  <div className="flex items-start gap-3 py-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <AgentIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-muted-foreground tabular-nums">{item.time}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs font-normal ${categoryColors[item.category] || "border-border/50 text-muted-foreground"}`}
                        >
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">{item.agent}</span>
                      </div>
                      <p className="text-sm">{item.event}</p>
                    </div>
                    <StatusIcon className={`h-4 w-4 shrink-0 mt-0.5 ${statusColor}`} />
                  </div>
                  {i < events.length - 1 && <Separator className="bg-border/30" />}
                </div>
              );
            })}
            {events.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
