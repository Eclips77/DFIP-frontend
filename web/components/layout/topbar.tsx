"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";

// A simple function to capitalize the first letter of a string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Topbar() {
  const pathname = usePathname();
  // Derive a title from the current path.
  // e.g., /alerts -> Alerts
  const title = pathname === "/" ? "Overview" : capitalize(pathname.substring(1));

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 md:px-10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for alerts, people, or cameras..."
            className="w-full rounded-lg bg-muted pl-10"
          />
        </div>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
          <span className="sr-only">User Profile</span>
        </Button>
      </div>
    </header>
  );
}
