"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera, Users, Calendar, Activity, User } from "lucide-react";
import { useGetCameraPeople, CameraPerson } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/date-utils";
import { PersonGallery } from "@/components/person-gallery";

interface CameraPeopleGalleryProps {
  cameraId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface PersonCardProps {
  person: CameraPerson;
  cameraId: string;
  onClick?: () => void;
}

function PersonCard({ person, cameraId, onClick }: PersonCardProps) {
  const shortPersonId = person.personId.slice(0, 12) + "...";
  
  return (
    <div 
      className="glass-panel border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:bg-white/10 transition-all duration-300 p-4"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <Icon icon={User} className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-medium">{shortPersonId}</h3>
            <p className="text-xs text-muted-foreground">Person ID</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {person.detectionCount} detections
        </Badge>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Icon icon={Calendar} className="w-3 h-3" />
            First:
          </span>
          <span className="font-mono">
            {person.firstDetection ? formatDateTime(person.firstDetection) : "N/A"}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Icon icon={Calendar} className="w-3 h-3" />
            Last:
          </span>
          <span className="font-mono">
            {person.lastDetection ? formatDateTime(person.lastDetection) : "N/A"}
          </span>
        </div>
      </div>
      
      <div className="pt-3 border-t border-white/10 mt-3">
        <p className="text-xs text-center text-muted-foreground hover:text-blue-400 transition-colors">
          Click to view all images →
        </p>
      </div>
    </div>
  );
}

export function CameraPeopleGallery({ cameraId, isOpen, onOpenChange }: CameraPeopleGalleryProps) {
  const { data: people, isLoading, isError } = useGetCameraPeople(cameraId);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  
  const shortCameraId = cameraId ? (cameraId.length > 12 ? cameraId.slice(0, 12) + "..." : cameraId) : "";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon icon={Camera} className="w-5 h-5" />
              Camera People: {shortCameraId}
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
                Failed to load people for this camera.
              </div>
            )}
            
            {people && people.length === 0 && (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No people detected by this camera.
              </div>
            )}
            
            {people && people.length > 0 && (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon icon={Users} className="w-4 h-4" />
                    <span>{people.length} Unique People</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon icon={Activity} className="w-4 h-4" />
                    <span>{people.reduce((sum, p) => sum + p.detectionCount, 0)} Total Detections</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon icon={Calendar} className="w-4 h-4" />
                    <span>Latest: {people.find(p => p.lastDetection)?.lastDetection ? 
                      formatDateTime(people.find(p => p.lastDetection)!.lastDetection!) : "N/A"}</span>
                  </div>
                </div>
                
                {/* People Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {people.map((person, index) => (
                    <PersonCard 
                      key={`${person.personId}-${index}`} 
                      person={person}
                      cameraId={cameraId!}
                      onClick={() => setSelectedPersonId(person.personId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Person Gallery Modal */}
      <PersonGallery
        personId={selectedPersonId}
        isOpen={Boolean(selectedPersonId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPersonId(null);
          }
        }}
      />
    </>
  );
}