"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Bell, Users, Image as ImageIcon, Video } from "lucide-react";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

const navItems = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/people", label: "People", icon: Users },
  { href: "/images", label: "Images", icon: ImageIcon },
  { href: "/cameras", label: "Cameras", icon: Video },
];

const variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
};

import { Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel hidden w-68 shrink-0 flex-col border border-white/10 p-6 md:flex">
      <div className="mb-12 flex items-center gap-3">
        <div className="glow-ring flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 to-accent/70">
          <Icon icon={Bell} className="h-6 w-6 text-background" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Sentinel</span>
          <h1 className="neon-text text-xl font-semibold">Intelligence</h1>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item, i) => (
          <motion.div
            key={item.href}
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
          >
            <Link
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground",
                pathname === item.href &&
                  "bg-gradient-to-r from-primary/30 to-primary/10 text-foreground shadow-[0_18px_38px_rgba(88,101,242,0.28)]"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all",
                  pathname === item.href && "bg-primary/50 text-primary-foreground"
                )}
              >
                <Icon icon={item.icon} className="h-5 w-5" />
              </span>
              <span className="text-base">{item.label}</span>
              {item.label === "Alerts" && (
                <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/80 text-[11px] font-semibold text-destructive-foreground">
                  3
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-4 text-sm text-muted-foreground"
      >
        <p className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
          System Health
          <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.65)]" />
        </p>
        <p className="text-sm text-muted-foreground">
          All sensors are operating within nominal parameters. Incident feed refreshing every 12s.
        </p>
      </motion.div>

      <Link
        href="#"
        className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground"
      >
        <Icon icon={Settings} className="h-5 w-5" />
        <span>Command Center Preferences</span>
      </Link>
    </aside>
  );
}
