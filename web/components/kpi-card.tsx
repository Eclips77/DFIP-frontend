"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

// Custom hook for the count-up animation
function useCountUp(end: number, duration: number = 1.5) {
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
  value: number;
  icon: React.ReactNode;
  description?: string;
}

export function KpiCard({ title, value, icon, description }: KpiCardProps) {
  const animatedValue = useCountUp(value);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <motion.div className="text-2xl font-bold">{animatedValue}</motion.div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
