
"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useInView } from "react-intersection-observer";

import { useGetAlerts, type Alert } from "@/hooks/use-api";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDateTime } from "@/lib/date-utils";
import { ImagePreviewModal } from "./image-preview-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Image as ImageIcon, Info, Loader2, ShieldCheck } from "lucide-react";
import { Icon } from "@/components/ui/icon";

const levelIcons: Record<string, ReactNode> = {
  alert: <AlertTriangle className="h-4 w-4 text-destructive" suppressHydrationWarning />,
  info: <Info className="h-4 w-4 text-blue-500" suppressHydrationWarning />,
  warning: <ShieldCheck className="h-4 w-4 text-yellow-500" suppressHydrationWarning />,
};

interface AlertsTableProps {
  limit?: number;
  level?: string;
  messageSearch?: string;
}

export function AlertsTable({ limit, level, messageSearch }: AlertsTableProps) {
  const debouncedSearch = useDebounce(messageSearch ?? "", 300);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAlerts({
    page_size: limit,
    level,
    message_search: debouncedSearch || undefined,
  });

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const alerts: Alert[] = useMemo(() => {
    const pages = (data?.pages ?? []) as Alert[][];
    return pages.flatMap((page) => page);
  }, [data]);


  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: limit ?? 10 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : "Failed to load alerts";
    return <div className="text-destructive">Error: {message}</div>;
  }

  if (alerts.length === 0) {
    return <div className="text-muted-foreground">No alerts found.</div>;
  }

  const tableContent = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Level</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Camera</TableHead>
          <TableHead>Person ID</TableHead>
          <TableHead className="text-center">Image</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => {
          const icon = levelIcons[alert.level] ?? levelIcons.alert;

          return (
            <TableRow
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className="cursor-pointer"
            >
              <TableCell>
                <Badge variant={alert.level === "alert" ? "destructive" : "secondary"} className="text-xs">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="capitalize">{alert.level}</span>
                  </div>
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{alert.message}</TableCell>
              <TableCell className="text-muted-foreground hidden md:table-cell">
                {formatDateTime(alert.time)}
              </TableCell>
              <TableCell className="text-muted-foreground hidden lg:table-cell">
                {alert.cameraId || "—"}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground hidden lg:table-cell">
                {alert.personId ? alert.personId.slice(0, 12).concat("...") : "—"}
              </TableCell>
              <TableCell className="text-center">
                {alert.imageId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedImageId(alert.imageId);
                    }}
                  >
                    <Icon icon={ImageIcon} className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <>
      {limit ? <div>{tableContent}</div> : <Card>{tableContent}</Card>}

      <div ref={ref} className="flex justify-center p-4">
        {isFetchingNextPage && (
          <Icon icon={Loader2} className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
        {!isFetchingNextPage && !hasNextPage && (
          <p className="text-sm text-muted-foreground">End of results.</p>
        )}
      </div>

      <ImagePreviewModal
        imageId={selectedImageId}
        isOpen={Boolean(selectedImageId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImageId(null);
          }
        }}
      />

      <Drawer
        open={Boolean(selectedAlert)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAlert(null);
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Alert Details</DrawerTitle>
            <DrawerDescription>{selectedAlert?.message}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="json">Raw JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-2 py-4 text-sm">
                <p><span className="font-medium">Time:</span> {selectedAlert ? formatDateTime(selectedAlert.time) : "—"}</p>
                <p><span className="font-medium">Level:</span> {selectedAlert?.level ?? "—"}</p>
                <p><span className="font-medium">Camera:</span> {selectedAlert?.cameraId ?? "—"}</p>
                <p><span className="font-medium">Person ID:</span> {selectedAlert?.personId ?? "—"}</p>
              </TabsContent>
              <TabsContent value="json" className="py-4">
                <pre className="h-[360px] overflow-auto rounded-md bg-muted p-4 text-xs">
                  {selectedAlert ? JSON.stringify(selectedAlert, null, 2) : "{}"}
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
