"use client";

import { useGetAlerts } from "@/hooks/use-api";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { ImageCard } from "@/components/image-card";
import { ImagePreviewModal } from "@/components/image-preview-modal";

export default function ImagesPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAlerts({});

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const alertsWithImages = data?.pages.flatMap((page) => page).filter(alert => alert.imageId) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive">Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Image Gallery</h1>
            <p className="text-muted-foreground">
                A gallery of all images captured from alerts.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {alertsWithImages.map((alert) => (
                <ImageCard key={alert.id} alert={alert} onImageClick={setSelectedImageId} />
            ))}
        </div>

        <div ref={ref} className="flex justify-center p-4">
            {isFetchingNextPage && (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
            {!hasNextPage && alertsWithImages.length > 0 && (
                <p className="text-sm text-muted-foreground">End of results.</p>
            )}
        </div>

        <ImagePreviewModal
            imageId={selectedImageId}
            isOpen={!!selectedImageId}
            onOpenChange={(isOpen) => !isOpen && setSelectedImageId(null)}
        />
    </div>
  );
}
