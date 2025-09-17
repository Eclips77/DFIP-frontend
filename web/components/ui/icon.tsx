"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  icon: LucideIcon;
  className?: string;
  [key: string]: unknown;
}

/**
 * Icon wrapper component that suppresses hydration warnings.
 * This prevents React hydration mismatches caused by browser extensions
 * (like Dark Reader) that inject attributes into SVG elements.
 */
export function Icon({ icon: IconComponent, className, ...props }: IconProps) {
  return (
    <IconComponent 
      className={cn(className)} 
      suppressHydrationWarning
      {...props} 
    />
  );
}