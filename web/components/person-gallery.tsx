"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Calendar, Camera, AlertTriangle } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { useGetPersonImages, PersonImage } from "@/hooks/use-api";
import { PersonImagePreviewModal } from "@/components/person-image-preview-modal";
import { formatDateTime } from "@/lib/date-utils";
import Image from "next/image";

interface PersonGalleryProps {
  personId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface ImageCardProps {
  image: PersonImage;
  onClick?: () => void;
}

function ImageCard({ image, onClick }: ImageCardProps) {
  const levelColors = {
    alert: "destructive",
    warning: "secondary", 
    info: "outline"
  } as const;

  return (
    <div 
      className="glass-panel border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:bg-white/10 transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <Image
          src={`http://localhost:8000/api/v1/images/by-image-id/${image.imageId}/thumbnail`}
          alt={`Alert from ${image.cameraId}`}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={levelColors[image.alertLevel as keyof typeof levelColors]} className="text-xs">
            {image.alertLevel}
          </Badge>
        </div>
      </div>
      
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon icon={Camera} className="w-3 h-3" />
            <span>{image.cameraId}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon icon={Calendar} className="w-3 h-3" />
            <span>{formatDateTime(image.alertTime)}</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2">
          {image.message}
        </p>
      </div>
    </div>
  );
}

export function PersonGallery({ personId, isOpen, onOpenChange }: PersonGalleryProps) {
  const { data: images, isLoading, isError } = useGetPersonImages(personId);
  const [selectedImage, setSelectedImage] = useState<PersonImage | null>(null);
  
  const shortPersonId = personId ? personId.slice(0, 12) + "..." : "";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-mono">
              Person Gallery: {shortPersonId}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Icon icon={Loader2} className="h-16 w-16 animate-spin text-muted-foreground" />
              </div>
            )}
            
            {isError && (
              <div className="flex items-center justify-center h-64 text-destructive">
                Failed to load images for this person.
              </div>
            )}
            
            {images && images.length === 0 && (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No images found for this person.
              </div>
            )}
            
            {images && images.length > 0 && (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon icon={Camera} className="w-4 h-4" />
                    <span>{images.length} Images</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon icon={AlertTriangle} className="w-4 h-4" />
                    <span>{images.length} Alerts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon icon={Calendar} className="w-4 h-4" />
                    <span>Latest: {formatDateTime(images[0]?.alertTime || "")}</span>
                  </div>
                </div>
                
                {/* Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                  {images.map((image, index) => (
                    <ImageCard 
                      key={`${image.imageId}-${index}`} 
                      image={image}
                      onClick={() => setSelectedImage(image)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Details Modal */}
      <PersonImagePreviewModal
        image={selectedImage}
        personId={personId}
        isOpen={Boolean(selectedImage)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null);
          }
        }}
      />
    </>
  );
}