"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex-1 overflow-hidden px-6 py-6">
      <Card className="border-red-500/30 bg-red-500/5 max-w-lg mx-auto mt-12">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-sm font-medium text-red-500">
              Health Check Failed
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || "Unable to fetch health status. The system may be experiencing issues."}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              Error ID: {error.digest}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="gap-2 border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
