"use client";

import { useGetImageMetadata } from "@/hooks/use-api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface ImagePreviewModalProps {
  imageId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ImagePreviewModal({ imageId, isOpen, onOpenChange }: ImagePreviewModalProps) {
  const { data: imageMetadata, isLoading, isError } = useGetImageMetadata(imageId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Image Preview</DialogTitle>
        </DialogHeader>
        <div className="flex h-[70vh] items-center justify-center">
          {isLoading && <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />}
          {isError && <div className="text-destructive">Failed to load image.</div>}
          {imageMetadata && (
            <div className="relative h-full w-full">
                <Image
                    src={`/api/v1/images/${imageMetadata.id}/bytes`}
                    alt={`Alert image ${imageId}`}
                    layout="fill"
                    objectFit="contain"
                />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
