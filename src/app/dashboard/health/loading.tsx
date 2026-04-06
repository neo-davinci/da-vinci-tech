import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Header skeleton */}
      <div className="border-b border-border/50 bg-gradient-to-b from-muted/20 to-background px-6 py-10">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
        <div className="flex items-center gap-2 mt-4">
          <Skeleton className="h-5 w-32 rounded-full" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="px-6 py-6 space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16 mt-1" />
            </CardHeader>
            <CardContent className="space-y-1">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center justify-between py-2">
                  <Skeleton className="h-4 w-40" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
