"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

const createTitle = (path: string) => {
  if (path === "/" || path.length <= 1) return "Mission Overview";
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, " "))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");
};

export function Topbar() {
  const pathname = usePathname();
  const title = createTitle(pathname);

  return (
    <header className="glass-panel mx-6 mt-6 flex flex-col gap-6 border border-white/10 px-6 py-5 md:mx-12 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/80">
          Sentinel Command Center
        </p>
        <div className="flex items-center gap-3">
          <h1 className="neon-text text-3xl font-semibold leading-tight md:text-4xl">
            {title}
          </h1>
          <span className="glow-ring rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Live Feed
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
            Updated {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
            12 data sources synced
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
        <div className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition-colors focus-within:border-primary/60 md:min-w-[280px]">
          <Icon icon={Search} className="h-4 w-4 text-muted-foreground/70 transition-colors group-focus-within:text-primary" />
          <Input
            type="search"
            placeholder="Search alerts, assets, operators..."
            className="h-auto border-none bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <div className="glow-ring rounded-2xl border border-white/10 bg-white/5 p-2">
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            className={cn(
              "glow-ring flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-left text-sm text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground"
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/50 to-accent/60 text-background">
              <Icon icon={User} className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Ariel Cohen</span>
              <span className="text-xs text-muted-foreground">Duty Supervisor</span>
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
