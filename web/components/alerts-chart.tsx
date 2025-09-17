"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Brush } from "recharts"
import { useTheme } from "next-themes"
import { useGetStatsOverTime } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Date
            </span>
            <span className="font-bold text-muted-foreground">
              {new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Alerts
            </span>
            <span className="font-bold text-foreground">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function AlertsChart() {
  const { theme } = useTheme()
  const { data: chartData, isLoading } = useGetStatsOverTime(30) // Fetch more data for brushing

  // Format date for the X-axis tick
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const colors = useMemo(() => ({
    light: { text: "hsl(var(--muted-foreground))", fill: "hsl(var(--primary))", stroke: "hsl(var(--primary))" },
    dark: { text: "hsl(var(--muted-foreground))", fill: "hsl(var(--primary))", stroke: "hsl(var(--primary))" },
  }), []);

  const currentColors = colors[theme === "dark" ? "dark" : "light"]

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <p className="text-muted-foreground">No data available for this period.</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={currentColors.fill} stopOpacity={0.8} />
            <stop offset="95%" stopColor={currentColors.fill} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
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
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke={currentColors.stroke}
          fill="url(#colorFill)"
          fillOpacity={1}
          strokeWidth={2}
          isAnimationActive={true}
          animationDuration={800}
        />
        <Brush dataKey="timeBucket" height={30} stroke={currentColors.stroke} tickFormatter={formatDate} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
