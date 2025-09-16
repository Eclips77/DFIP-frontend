"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"
import { useGetStatsOverTime } from "@/hooks/use-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AlertsChart() {
  const { theme } = useTheme()
  const { data: chartData, isLoading } = useGetStatsOverTime(7)

  // Format date for the X-axis tick
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Alerts Over Time</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No data available for this period.</p>
            </CardContent>
        </Card>
    )
  }

  // Recharts theme colors
  const colors = {
    light: { text: "#1e293b", fill: "#3b82f6", stroke: "#3b82f6" },
    dark: { text: "#f8fafc", fill: "#3b82f6", stroke: "#3b82f6" },
  }
  const currentColors = colors[theme === "dark" ? "dark" : "light"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts Over Time</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentColors.fill} stopOpacity={0.8} />
                <stop offset="95%" stopColor={currentColors.fill} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="timeBucket"
              stroke={currentColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatDate}
            />
            <YAxis
              stroke={currentColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#020817" : "#ffffff",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={currentColors.stroke}
              fill="url(#colorUv)"
              fillOpacity={1}
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
