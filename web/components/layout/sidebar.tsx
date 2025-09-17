"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Bell, Users, Image as ImageIcon, Video } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/people", label: "People", icon: Users },
  { href: "/images", label: "Images", icon: ImageIcon },
  { href: "/cameras", label: "Cameras", icon: Video },
];

const variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: "easeIn",
    },
  }),
};

import { Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
          <Bell className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Sentinel</h1>
      </div>
      <div className="flex h-full flex-col justify-between">
        <nav className="flex flex-col gap-2">
          {navItems.map((item, i) => (
            <motion.div key={item.href} custom={i} initial="hidden" animate="visible" variants={variants}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:bg-accent hover:text-primary",
                  pathname === item.href && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-md font-medium">{item.label}</span>
                {item.label === "Alerts" && (
                  <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                    3
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="mt-auto">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:bg-accent hover:text-primary"
          >
            <Settings className="h-5 w-5" />
            <span className="text-md font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
