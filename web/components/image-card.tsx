"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type paths } from "@/lib/api-types";
import { motion } from "framer-motion";

type Alert = paths["/api/v1/alerts"]["get"]["responses"]["200"]["content"]["application/json"][0];

interface ImageCardProps {
  alert: Alert;
  onImageClick: (imageId: string) => void;
}

export function ImageCard({ alert, onImageClick }: ImageCardProps) {
  if (!alert.imageId) {
    return null;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card
        className="overflow-hidden cursor-pointer group"
        onClick={() => onImageClick(alert.imageId!)}
      >
        <CardContent className="p-0">
          <img
            src={`/api/v1/images/${alert.imageId}/thumb`}
            alt={alert.message}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="p-4">
            <p className="text-sm font-medium truncate">{alert.message}</p>
            <p className="text-xs text-muted-foreground">{new Date(alert.time).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
