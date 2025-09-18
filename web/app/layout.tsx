import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ClientOnlyGlobalLoadingIndicator } from "@/components/client-only-global-loading";

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sentinel Intelligence",
  description: "Immersive situational awareness dashboard powered by MongoDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="relative flex min-h-screen overflow-hidden">
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-[10%] top-[12%] h-64 w-64 rounded-full bg-primary/40 blur-[120px]" />
                <div className="absolute right-[8%] top-[18%] h-56 w-56 rounded-full bg-accent/35 blur-[120px]" />
                <div className="absolute bottom-[10%] left-1/2 h-80 w-[520px] -translate-x-1/2 rounded-[999px] bg-primary/20 blur-[150px]" />
              </div>
              <Sidebar />
              <div className="relative z-10 flex flex-1 flex-col">
                <Topbar />
                <main className="flex-1 px-6 pb-12 pt-10 md:px-12">
                  <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
                    {children}
                  </div>
                </main>
              </div>
              {/* <ClientOnlyGlobalLoadingIndicator /> */}
              <Toaster position="top-right" />
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
