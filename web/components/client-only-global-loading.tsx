"use client";

import dynamic from "next/dynamic";

const GlobalLoadingIndicator = dynamic(
  () => import("@/components/global-loading-indicator").then(mod => ({default: mod.GlobalLoadingIndicator})),
  { ssr: false }
);

export function ClientOnlyGlobalLoadingIndicator() {
  return <GlobalLoadingIndicator />;
}