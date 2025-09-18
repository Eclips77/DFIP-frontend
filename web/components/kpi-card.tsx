"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { ClientOnly } from "@/components/client-only";
import {
  useEffect,
  useRef,
} from "react";

// Custom hook for the count-up animation
function useCountUp(end: number) {
  const count = useRef(0);
  const motionValue = useSpring(0, {
    damping: 100,
    stiffness: 100,
  });

  useEffect(() => {
    motionValue.set(end);
  }, [end, motionValue]);

  useEffect(
    () =>
      motionValue.on("change", (latest) => {
        count.current = latest;
      }),
    [motionValue]
  );

  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  return rounded;
}

interface KpiCardProps {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  trendDirection?: "up" | "down";
}

export function KpiCard({
  title,
  value,
  icon,
  description,
  trend,
  trendDirection = "up",
}: KpiCardProps) {
  const animatedValue = useCountUp(value || 0);
  const IconComponent = icon;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 -z-10 text-muted/20">
        <ClientOnly>
          <IconComponent className="h-32 w-32" />
        </ClientOnly>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ClientOnly fallback={<div className="text-4xl font-bold tracking-tighter">0</div>}>
          <motion.div className="text-4xl font-bold tracking-tighter">
            {animatedValue}
          </motion.div>
        </ClientOnly>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          {trend && (
            <span
              className={`flex items-center gap-1 ${
                trendDirection === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              <ArrowUpRight
                className={`h-4 w-4 ${
                  trendDirection === "down" ? "rotate-90" : ""
                }`}
              />
              {trend}
            </span>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
