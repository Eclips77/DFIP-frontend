"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Camera, Users, Activity, Calendar, Clock } from "lucide-react";
import { CameraSummary } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/date-utils";

interface CameraCardProps {
  camera: CameraSummary;
  onClick?: () => void;
}

export function CameraCard({ camera, onClick }: CameraCardProps) {
  const formatCameraId = (cameraId: string) => {
    // If it's a long ID, show first 8 chars + ...
    if (cameraId.length > 12) {
      return `${cameraId.slice(0, 8)}...`;
    }
    return cameraId;
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-white/20 bg-white/5 backdrop-blur-sm min-h-[240px]"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Icon icon={Camera} className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-mono">
                {formatCameraId(camera.cameraId)}
              </CardTitle>
              <p className="text-xs text-muted-foreground">Camera ID</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-500 font-medium">Active</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon icon={Activity} className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-muted-foreground">Detections</span>
            </div>
            <Badge variant="secondary" className="text-xs font-mono px-2 py-1">
              {camera.totalDetections.toLocaleString()}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon icon={Users} className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">People</span>
            </div>
            <Badge variant="outline" className="text-xs font-mono px-2 py-1">
              {camera.uniquePeople}
            </Badge>
          </div>
        </div>
        
        {/* Time Information */}
        <div className="space-y-2">
          {camera.firstDetection && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Icon icon={Calendar} className="w-3 h-3" />
                First:
              </span>
              <span className="font-mono text-xs">
                {formatDateTime(camera.firstDetection)}
              </span>
            </div>
          )}
          
          {camera.lastDetection && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Icon icon={Clock} className="w-3 h-3" />
                Last:
              </span>
              <span className="font-mono text-xs">
                {formatDateTime(camera.lastDetection)}
              </span>
            </div>
          )}
        </div>
        
        {/* Click hint */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-xs text-center text-muted-foreground group-hover:text-blue-400 transition-colors font-medium">
            Click to view detected people →
          </p>
        </div>
      </CardContent>
    </Card>
  );
}