"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  
  const isLoading = isFetching > 0 || isMutating > 0;

  if (!isLoading) return null;

  return (
    <div 
      className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-400 backdrop-blur-sm"
      suppressHydrationWarning
    >
      <Loader2 className={cn("h-4 w-4 animate-spin")} />
      <span suppressHydrationWarning>Updating data...</span>
    </div>
  );
}