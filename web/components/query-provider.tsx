"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 10 minutes before considering it stale
        staleTime: 10 * 60 * 1000, // 10 minutes
        // Keep data in cache for 30 minutes before garbage collection
        gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime in older versions)
        // Retry failed requests
        retry: 2,
        // Don't refetch on window focus by default (can be overridden per query)
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect by default
        refetchOnReconnect: false,
        // Show cached data while fetching in background
        refetchOnMount: 'always', // This ensures fresh data when component mounts
      },
    },
  }));

  const [persister] = useState(() =>
    typeof window !== 'undefined' 
      ? createSyncStoragePersister({
          storage: window.localStorage,
          key: 'DFIP_QUERY_CACHE',
        })
      : undefined
  );

  // If we're on the server or persister failed to create, use regular provider
  if (typeof window === 'undefined' || !persister) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider 
      client={queryClient} 
      persistOptions={{ 
        persister,
        maxAge: 2 * 60 * 60 * 1000, // 2 hours max age for persisted data
        buster: "v1", // Change this to clear all caches
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
