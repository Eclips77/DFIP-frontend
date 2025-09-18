"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetCameras } from "@/hooks/use-api";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { Loader2, Camera, Search, AlertCircle } from "lucide-react";
import { CameraCard } from "@/components/camera-card";
import { CameraPeopleGallery } from "@/components/camera-people-gallery";

export default function CamerasPage() {
  const { data: cameras, isError, isInitialLoading } = useGetCameras();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  // Check for cameraId in URL params
  useEffect(() => {
    const cameraIdFromUrl = searchParams.get('cameraId');
    if (cameraIdFromUrl) {
      setSelectedCameraId(cameraIdFromUrl);
      setSearchTerm(cameraIdFromUrl); // Pre-fill search with camera ID
    }
  }, [searchParams]);

  // Filter cameras based on search term
  const filteredCameras = cameras?.filter(camera =>
    camera.cameraId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Icon icon={Camera} className="w-8 h-8" />
          Cameras
        </h1>
        <p className="text-muted-foreground">
          Browse all cameras and view detected people for each camera.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Icon icon={Search} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cameras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {cameras && (
          <div className="text-sm text-muted-foreground">
            {filteredCameras.length} of {cameras.length} cameras
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-h-[60vh]">
        {isInitialLoading && (
          <div className="flex items-center justify-center h-64">
            <Icon icon={Loader2} className="h-16 w-16 animate-spin text-muted-foreground" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center h-64 text-destructive">
            <Icon icon={AlertCircle} className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Failed to load cameras</h2>
            <p className="text-muted-foreground">Please try refreshing the page.</p>
          </div>
        )}

        {cameras && cameras.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Icon icon={Camera} className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No cameras found</h2>
            <p>No cameras have been detected in the system yet.</p>
          </div>
        )}

        {filteredCameras.length === 0 && cameras && cameras.length > 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Icon icon={Search} className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No matching cameras</h2>
            <p>Try adjusting your search term.</p>
          </div>
        )}

        {filteredCameras.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredCameras.map((camera) => (
              <CameraCard
                key={camera.cameraId}
                camera={camera}
                onClick={() => setSelectedCameraId(camera.cameraId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Camera People Gallery Modal */}
      <CameraPeopleGallery
        cameraId={selectedCameraId}
        isOpen={Boolean(selectedCameraId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCameraId(null);
          }
        }}
      />
    </div>
  );
}
