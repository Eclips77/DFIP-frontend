"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { getImageThumbnailUrl } from "@/lib/api-client";
import { 
  Loader2, 
  Calendar, 
  Camera, 
  User, 
  Database, 
  FileImage, 
  Clock,
  AlertTriangle,
  Info,
  ShieldCheck
} from "lucide-react";
import { useGetImageMetadata, Alert } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/date-utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AlertImagePreviewModalProps {
  imageId: string | null;
  alert?: Alert | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const levelIcons = {
  alert: AlertTriangle,
  warning: ShieldCheck,
  info: Info,
} as const;

const levelColors = {
  alert: "destructive",
  warning: "secondary", 
  info: "outline"
} as const;

export function AlertImagePreviewModal({ 
  imageId, 
  alert, 
  isOpen, 
  onOpenChange 
}: AlertImagePreviewModalProps) {
  const { data: imageMetadata, isLoading, isError } = useGetImageMetadata(imageId);
  const router = useRouter();

  if (!imageId) return null;

  const AlertIcon = levelIcons[alert?.level as keyof typeof levelIcons] || AlertTriangle;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon={FileImage} className="w-5 h-5" />
            Alert Image Details
            {alert && (
              <Badge variant={levelColors[alert.level as keyof typeof levelColors]} className="ml-2">
                <Icon icon={AlertIcon} className="w-3 h-3 mr-1" />
                {alert.level}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Icon icon={Loader2} className="h-16 w-16 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {isError && (
            <div className="flex items-center justify-center h-64 text-destructive">
              Failed to load image metadata.
            </div>
          )}
          
          {imageMetadata && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Image Display */}
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon icon={FileImage} className="w-5 h-5" />
                  Image Preview
                </h3>
                <div className="relative flex-1 bg-black/5 rounded-lg overflow-hidden min-h-[300px]">
                  <Image
                    src={getImageThumbnailUrl(imageId)}
                    alt={`Alert image ${imageId}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Metadata Display */}
              <div className="flex flex-col space-y-6 overflow-y-auto">
                {/* Alert Information */}
                {alert && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Icon icon={AlertTriangle} className="w-5 h-5" />
                      Alert Information
                    </h3>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-muted-foreground">Message:</span>
                        <span className="font-medium text-right max-w-[60%]">{alert.message}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Icon icon={Calendar} className="w-4 h-4" />
                          Alert Time:
                        </span>
                        <span className="font-mono">{formatDateTime(alert.time)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Icon icon={Camera} className="w-4 h-4" />
                          Camera ID:
                        </span>
                        {alert.cameraId ? (
                          <button
                            className="font-mono hover:text-blue-400 hover:underline transition-colors cursor-pointer"
                            onClick={() => router.push(`/cameras?cameraId=${alert.cameraId}`)}
                            title="Click to view this camera's details"
                          >
                            {alert.cameraId}
                          </button>
                        ) : (
                          <span className="font-mono">N/A</span>
                        )}
                      </div>
                      {alert.personId && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Icon icon={User} className="w-4 h-4" />
                            Person ID:
                          </span>
                          <button
                            className="font-mono text-xs hover:text-blue-400 hover:underline transition-colors cursor-pointer"
                            onClick={() => router.push(`/people?personId=${alert.personId}`)}
                            title="Click to view this person's details"
                          >
                            {alert.personId}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Technical Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Icon icon={Database} className="w-5 h-5" />
                    Technical Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-muted-foreground">Image ID:</span>
                      <span className="font-mono text-xs">{imageId}</span>
                    </div>
                    {imageMetadata.uploadDate && (
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Icon icon={Clock} className="w-4 h-4" />
                          Upload Date:
                        </span>
                        <span className="font-mono">{formatDateTime(imageMetadata.uploadDate)}</span>
                      </div>
                    )}
                    {imageMetadata.length && (
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-muted-foreground">File Size:</span>
                        <span className="font-mono">{(imageMetadata.length / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    )}
                    {imageMetadata.filename && (
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-muted-foreground">Filename:</span>
                        <span className="font-mono">{imageMetadata.filename}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* GridFS Metadata */}
                {imageMetadata.metadata && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Icon icon={Database} className="w-5 h-5" />
                      GridFS Metadata
                    </h3>
                    <div className="p-3 bg-black/10 rounded-lg">
                      <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                        {JSON.stringify(imageMetadata.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Raw Alert Data */}
                {alert && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Icon icon={Database} className="w-5 h-5" />
                      Raw Alert Data
                    </h3>
                    <div className="p-3 bg-black/10 rounded-lg">
                      <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                        {JSON.stringify(alert, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}