"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

// A simple function to capitalize the first letter of a string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Topbar() {
  const pathname = usePathname();
  // Derive a title from the current path.
  // e.g., /alerts -> Alerts
  const title = pathname === "/" ? "Overview" : capitalize(pathname.substring(1));

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {/* Breadcrumbs could go here in the future */}
      </div>
      <div className="flex items-center gap-4">
        {/* Other topbar items like user profile can go here */}
        <ThemeToggle />
      </div>
    </header>
  );
}
