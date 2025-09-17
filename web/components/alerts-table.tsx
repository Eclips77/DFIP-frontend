"use client";

import { useGetAlerts } from "@/hooks/use-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Info, ShieldCheck, Loader2, Image as ImageIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type paths } from "@/lib/api-types";
import { ImagePreviewModal } from "./image-preview-modal";

type Alert = paths["/api/v1/alerts"]["get"]["responses"]["200"]["content"]["application/json"][0];

const levelIcons = {
  alert: <AlertTriangle className="h-4 w-4 text-destructive" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
  warning: <ShieldCheck className="h-4 w-4 text-yellow-500" />,
};

import { useDebounce } from "@/hooks/use-debounce";

interface AlertsTableProps {
  limit?: number;
  level?: string;
  messageSearch?: string;
}

export function AlertsTable({ limit, level, messageSearch }: AlertsTableProps) {
  const debouncedMessageSearch = useDebounce(messageSearch, 500);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAlerts({
    page_size: limit ?? 20,
    level: level,
    message_search: debouncedMessageSearch,
  });

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const alerts = data?.pages.flatMap((page) => page) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive">Error: {error.message}</div>;
  }

  if (alerts.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No alerts found.</div>
  }

  const tableContent = (
    <Table>
      {!limit && (
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Level</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Camera</TableHead>
            <TableHead>Person ID</TableHead>
            <TableHead className="text-center">Image</TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={alert.id} onClick={() => setSelectedAlert(alert)} className="cursor-pointer">
            <TableCell>
              <Badge variant={alert.level === 'alert' ? 'destructive' : 'secondary'} className="text-xs">
                <div className="flex items-center gap-2">
                    {levelIcons[alert.level]}
                    <span>{alert.level}</span>
                </div>
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{alert.message}</TableCell>
            <TableCell className="text-muted-foreground hidden md:table-cell">
              {new Date(alert.time).toLocaleString()}
            </TableCell>
            <TableCell className="text-muted-foreground hidden lg:table-cell">{alert.cameraId}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground hidden lg:table-cell">{alert.personId.substring(0, 12)}...</TableCell>
            <TableCell className="text-center">
              {alert.imageId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click from firing
                    setSelectedImageId(alert.imageId);
                  }}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      {limit ? <div>{tableContent}</div> : <Card>{tableContent}</Card>}

      {!limit && (
          <div ref={ref} className="flex justify-center p-4">
              {isFetchingNextPage ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : !hasNextPage && alerts.length > 0 ? (
                  <p className="text-sm text-muted-foreground">End of results.</p>
              ) : null}
          </div>
      )}

      <ImagePreviewModal
            imageId={selectedImageId}
            isOpen={!!selectedImageId}
            onOpenChange={(isOpen) => !isOpen && setSelectedImageId(null)}
        />

        <Drawer open={!!selectedAlert} onOpenChange={(isOpen) => !isOpen && setSelectedAlert(null)}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Alert Details</DrawerTitle>
                    <DrawerDescription>{selectedAlert?.message}</DrawerDescription>
                </DrawerHeader>
                <div className="px-4">
                    <Tabs defaultValue="details">
                        <TabsList>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="json">Raw JSON</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="py-4">
                           {/* TODO: Add a formatted details view */}
                           <p>Formatted details view will go here.</p>
                        </TabsContent>
                        <TabsContent value="json">
                            <pre className="mt-2 h-[450px] overflow-x-auto rounded-md bg-muted p-4">
                                <code className="text-muted-foreground">
                                    {JSON.stringify(selectedAlert, null, 2)}
                                </code>
                            </pre>
                        </TabsContent>
                    </Tabs>
                </div>
            </DrawerContent>
        </Drawer>
    </Card>
  );
}
