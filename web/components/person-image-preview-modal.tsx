"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera, AlertTriangle, User, Clock, MapPin } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { useGetImageMetadata, PersonImage } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/date-utils";
import { getImageThumbnailUrl } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PersonImagePreviewModalProps {
  image: PersonImage | null;
  personId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PersonImagePreviewModal({ image, personId, isOpen, onOpenChange }: PersonImagePreviewModalProps) {
  const { data: imageMetadata, isLoading, isError } = useGetImageMetadata(image?.imageId || null);
  const router = useRouter();
  
  const shortPersonId = personId ? personId.slice(0, 12) + "..." : "";
  
  const levelColors = {
    alert: "destructive",
    warning: "secondary", 
    info: "outline"
  } as const;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon={Camera} className="h-5 w-5" />
            Image Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Icon icon={Loader2} className="h-16 w-16 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {isError && (
            <div className="text-destructive text-center p-4">
              Failed to load image details.
            </div>
          )}
          
          {image && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Display */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-white/5 rounded-lg overflow-hidden">
                  <Image
                    src={getImageThumbnailUrl(image.imageId)}
                    alt={`Alert image from ${image.cameraId}`}
                    fill
                    style={{ objectFit: "contain" }}
                    className="transition-transform duration-300"
                  />
                  
                  {/* Alert Level Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant={levelColors[image.alertLevel as keyof typeof levelColors]} className="text-sm">
                      <Icon icon={AlertTriangle} className="w-3 h-3 mr-1" />
                      {image.alertLevel.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {/* Image Technical Info */}
                {imageMetadata && (
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-sm text-foreground">Technical Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">File Size:</span>
                        <span className="ml-2">{(imageMetadata.length / 1024).toFixed(1)} KB</span>
                      </div>
                      <div>
                        <span className="font-medium">Chunk Size:</span>
                        <span className="ml-2">{(imageMetadata.chunkSize / 1024).toFixed(1)} KB</span>
                      </div>
                      <div>
                        <span className="font-medium">Upload Date:</span>
                        <span className="ml-2">{formatDateTime(imageMetadata.uploadDate)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Filename:</span>
                        <span className="ml-2">{imageMetadata.filename}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Alert Information */}
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 space-y-4">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <Icon icon={AlertTriangle} className="w-4 h-4" />
                    Alert Information
                  </h4>
                  
                  <div className="space-y-3">
                    {/* Person ID */}
                    <div className="flex items-center gap-3">
                      <Icon icon={User} className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Person ID</div>
                        <div className="font-mono text-sm">{shortPersonId}</div>
                      </div>
                    </div>

                    {/* Alert Time */}
                    <div className="flex items-center gap-3">
                      <Icon icon={Clock} className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Alert Time</div>
                        <div className="text-sm">{formatDateTime(image.alertTime)}</div>
                      </div>
                    </div>

                    {/* Camera ID */}
                    <div className="flex items-center gap-3">
                      <Icon icon={Camera} className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Camera</div>
                        <button
                          className="text-sm hover:text-blue-400 hover:underline transition-colors cursor-pointer"
                          onClick={() => router.push(`/cameras?cameraId=${image.cameraId}`)}
                          title="Click to view this camera's details"
                        >
                          {image.cameraId}
                        </button>
                      </div>
                    </div>

                    {/* Alert Level */}
                    <div className="flex items-center gap-3">
                      <Icon icon={AlertTriangle} className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Alert Level</div>
                        <Badge variant={levelColors[image.alertLevel as keyof typeof levelColors]} className="text-xs">
                          {image.alertLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Image ID */}
                    <div className="flex items-center gap-3">
                      <Icon icon={MapPin} className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">Image ID</div>
                        <div className="font-mono text-xs text-muted-foreground break-all">{image.imageId}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert Message */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Alert Message</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {image.message}
                  </p>
                </div>

                {/* Metadata from GridFS */}
                {imageMetadata?.metadata && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Additional Metadata</h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-muted-foreground">Event Timestamp:</span>
                        <span className="ml-2 text-muted-foreground">
                          {formatDateTime(imageMetadata.metadata.eventTs)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Stored Image ID:</span>
                        <span className="ml-2 font-mono text-muted-foreground text-xs break-all">
                          {imageMetadata.metadata.imageId}
                        </span>
                      </div>
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