import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Hero skeleton */}
      <div className="border-b border-border/50 bg-gradient-to-b from-muted/30 to-background px-6 py-12">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-4 w-72" />
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-5 w-36 rounded-full" />
        </div>
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16 mt-1" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-1.5 w-1.5 rounded-full" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-32 mt-1" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick links skeleton */}
      <div className="px-6 pb-6">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-px" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-3 w-12" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
