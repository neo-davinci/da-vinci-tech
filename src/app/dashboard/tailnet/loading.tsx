import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Header skeleton */}
      <div className="border-b border-border/50 bg-gradient-to-b from-muted/20 to-background px-6 py-10">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-4 w-64" />
        <div className="flex items-center gap-3 mt-4">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Settings card */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-24 mt-1" />
          </CardHeader>
          <CardContent className="space-y-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Devices card */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-12 mt-1" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
