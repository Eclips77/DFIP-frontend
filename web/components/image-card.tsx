"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Alert } from "@/hooks/use-api";
import Image from "next/image";

interface ImageCardProps {
  alert: Alert;
  onImageClick: (imageId: string) => void;
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export function ImageCard({ alert, onImageClick }: ImageCardProps) {
  if (!alert.imageId) {
    return null;
  }

  const imageUrl = [API_BASE_URL, "api", "v1", "images", "by-image-id", alert.imageId, "thumb"].join("/");

  return (
    <Card
      className="group cursor-pointer overflow-hidden"
      onClick={() => onImageClick(alert.imageId as string)}
    >
      <CardContent className="relative h-48 w-full p-0">
        <Image
          src={imageUrl}
          alt={alert.message}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          style={{ objectFit: "cover" }}
          priority={false}
        />
      </CardContent>
      <div className="space-y-1 p-4">
        <p className="truncate text-sm font-medium">{alert.message}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(alert.time).toLocaleString()}
        </p>
      </div>
    </Card>
  );
}
