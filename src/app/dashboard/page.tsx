import { fetchStats } from "@/lib/data/stats";
import { fetchHealth } from "@/lib/data/health";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeroSection } from "@/components/ui/hero-section";
import { AreaGraph } from "@/features/overview/components/area-graph";
import { BarGraph } from "@/features/overview/components/bar-graph";
import { PieGraph } from "@/features/overview/components/pie-graph";
import {
  Activity,
  ArrowUpRight,
  Cpu,
  Database,
  Globe,
  Network,
  Shield,
  Zap,
  Server,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  const [stats, health] = await Promise.all([fetchStats(), fetchHealth()]);

  const checkedTime = new Date(health.checkedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const kpis = [
    { title: "System Status", value: "Nominal", icon: Activity, desc: "All systems operational" },
    { title: "Tailnet Nodes", value: stats.tailnetNodes.toString(), icon: Network, desc: stats.tailnetNodeDetail },
    { title: "API Health", value: stats.apiHealth, icon: Zap, desc: stats.apiHealthDescription },
    { title: "Cron Jobs", value: stats.cronJobs, icon: Cpu, desc: stats.cronJobsDescription },
  ];

  const systemKPIs = [
    { title: "Picks Today", value: "24", icon: TrendingUp, desc: "3.2% vs yesterday" },
    { title: "SEO Pages", value: "1,847", icon: Globe, desc: "+212 this week" },
    { title: "Active Workers", value: "3", icon: Server, desc: "Reddit, Quora, X" },
    { title: "Error Rate", value: "0.02%", icon: Shield, desc: "Last 24h" },
  ];

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Hero */}
      <HeroSection
        iconName="shield"
        label="Control Room"
        title="Neo OS"
        description={`Orlando, FL · Eastern Time · ${new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
      >
        <Badge
          variant="outline"
          className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          All Systems Nominal
        </Badge>
        <Badge variant="outline" className="text-xs text-muted-foreground border-border/50">
          <Globe className="h-3 w-3 mr-1" />
          tailnet-only
        </Badge>
        <Badge variant="outline" className="text-xs text-muted-foreground border-border/50">
          <Database className="h-3 w-3 mr-1" />
          Neo Obsidian active
        </Badge>
      </HeroSection>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 py-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DVB Stats Row */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {systemKPIs.map((kpi) => (
            <Card key={kpi.title} className="border-border/50 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 pb-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prediction Confidence</CardTitle>
            <CardDescription className="text-xs">Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <BarGraph />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <CardDescription className="text-xs">Last 24 hours · {stats.recentActivity.length} events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {stats.recentActivity.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{item.event}</span>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 pb-6">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Traffic Sources</CardTitle>
            <CardDescription className="text-xs">Organic vs Direct</CardDescription>
          </CardHeader>
          <CardContent>
            <PieGraph />
          </CardContent>
        </Card>
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Picks Performance Trend</CardTitle>
            <CardDescription className="text-xs">Daily picks generated · rolling 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaGraph />
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="px-4 pb-6">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Quick Access
              </span>
              <Separator orientation="vertical" className="h-4" />
              {[
                { label: "Health", href: "/dashboard/health" },
                { label: "Tailnet", href: "/dashboard/tailnet" },
                { label: "Activity", href: "/dashboard/activity" },
                { label: "Picks →", href: "https://picks.davincibets.io", external: true },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
