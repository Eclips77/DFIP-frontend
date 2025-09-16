"use client";

import { useGetStats } from "@/hooks/use-api";
import { KpiCard } from "@/components/kpi-card";
import { AlertsChart } from "@/components/alerts-chart";
import { Bell, Users, Video, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewPage() {
  const { data: stats, isLoading, isError, error } = useGetStats();

  const kpiData = [
    {
      title: "Total Alerts",
      value: stats?.totalAlerts,
      icon: <Bell className="h-5 w-5" />,
      description: "All alerts recorded.",
    },
    {
      title: "Alerts (Last 24h)",
      value: stats?.alerts24h,
      icon: <AlertTriangle className="h-5 w-5" />,
      description: "Alerts in the last 24 hours.",
    },
    {
      title: "Distinct People",
      value: stats?.distinctPeople,
      icon: <Users className="h-5 w-5" />,
      description: "Unique individuals detected.",
    },
    {
      title: "Active Cameras",
      value: stats?.activeCameras,
      icon: <Video className="h-5 w-5" />,
      description: "Cameras that have sent alerts.",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading || isError
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <div className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-5" />
                </div>
                <div>
                  <Skeleton className="h-7 w-1/2" />
                  <Skeleton className="mt-1 h-3 w-full" />
                </div>
              </div>
            ))
          : kpiData.map((kpi) => (
              <KpiCard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value ?? 0}
                icon={kpi.icon}
                description={kpi.description}
              />
            ))}
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <AlertsChart />
      </div>

      {isError && (
        <div className="text-destructive">
          Failed to load dashboard data: {error.message}
        </div>
      )}
    </div>
  );
}
