import { fetchHealth } from "@/lib/data/health";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/ui/hero-section";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Shield, Zap } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "operational"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
      : status === "degraded"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
      : "border-red-500/30 bg-red-500/10 text-red-500";

  return (
    <Badge variant="outline" className={`gap-1 text-xs font-normal ${color}`}>
      <CheckCircle2 className="h-2.5 w-2.5" />
      {status}
    </Badge>
  );
}

export default async function HealthPage() {
  const data = await fetchHealth();
  const checkedTime = new Date(data.checkedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const operational = data.components.filter((c) => c.status === "operational").length;
  const total = data.components.length;

  // Group components by category
  const groups = data.components.reduce(
    (acc, comp) => {
      acc[comp.category] = acc[comp.category] || [];
      acc[comp.category].push(comp);
      return acc;
    },
    {} as Record<string, typeof data.components>
  );

  const categoryIcons: Record<string, React.ElementType> = {
    Core: Zap,
    Integrations: Shield,
    Infrastructure: Zap,
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      <HeroSection
        icon={Shield}
        label="System Health"
        title="Health Monitor"
        description={`Checked at ${checkedTime} · ${operational}/${total} components operational`}
      >
        <Badge
          variant="outline"
          className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {data.uptime} uptime
        </Badge>
      </HeroSection>

      <div className="px-6 py-6 space-y-6">
        {(["Core", "Integrations", "Infrastructure"] as const).map((category) => {
          const items = groups[category] || [];
          if (items.length === 0) return null;
          const Icon = categoryIcons[category] || Zap;

          return (
            <Card key={category} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">{category}</CardTitle>
                </div>
                <CardDescription className="text-xs">{items.length} components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {items.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between py-2 text-sm">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground tabular-nums">{item.latency}</span>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                    {i < items.length - 1 && <Separator className="bg-border/30" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
