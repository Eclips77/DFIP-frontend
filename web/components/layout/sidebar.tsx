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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Bell className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item, i) => (
          <motion.div key={item.href} custom={i} initial="hidden" animate="visible" variants={variants}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href && "bg-accent text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
}
