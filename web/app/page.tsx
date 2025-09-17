"use client";

"use client";

import { useGetStats } from "@/hooks/use-api";
import { KpiCard } from "@/components/kpi-card";
import { AlertsChart } from "@/components/alerts-chart";
import { AlertsTable } from "@/components/alerts-table";
import { Bell, Users, Video, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OverviewPage() {
  const { data: stats, isLoading, isError, error } = useGetStats();

  const kpiData = [
    {
      title: "Total Alerts",
      value: stats?.totalAlerts,
      icon: <Bell />,
      description: "All alerts recorded.",
      trend: "+20.1% from last month",
    },
    {
      title: "Alerts (24h)",
      value: stats?.alerts24h,
      icon: <AlertTriangle />,
      description: "Alerts in the last 24 hours.",
      trend: "+180.1% from last day",
    },
    {
      title: "Distinct People",
      value: stats?.distinctPeople,
      icon: <Users />,
      description: "Unique individuals detected.",
      trend: "+19% from last month",
    },
    {
      title: "Active Cameras",
      value: stats?.activeCameras,
      icon: <Video />,
      description: "Cameras that have sent alerts.",
      trend: "+2 since last hour",
      trendDirection: "down",
    },
  ];

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-destructive">
          Failed to load dashboard data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
          : kpiData.map((kpi) => (
              <KpiCard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value ?? 0}
                icon={kpi.icon}
                description={kpi.description}
                trend={kpi.trend}
                trendDirection={kpi.trendDirection as "up" | "down"}
              />
            ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Alerts Over Time</CardTitle>
            <CardDescription>A chart of alerts over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AlertsChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              The 5 most recent alerts from the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertsTable limit={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-2/5" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2" />
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
