"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Camera, AlertTriangle } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { PersonSummary } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/date-utils";
import Image from "next/image";

interface PersonCardProps {
  person: PersonSummary;
  onClick?: () => void;
}

export function PersonCard({ person, onClick }: PersonCardProps) {
  const shortPersonId = person.personId.slice(0, 12) + "...";
  
  return (
    <Card 
      className="glass-panel cursor-pointer hover:bg-white/10 transition-all duration-300 border border-white/10"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
              {person.sampleImageId ? (
                <Image
                  src={`http://localhost:8000/api/v1/images/by-image-id/${person.sampleImageId}/thumbnail`}
                  alt={`Person ${shortPersonId}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon icon={Camera} className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Person Info */}
          <div className="text-center space-y-2">
            <h3 className="font-mono text-sm font-medium text-foreground">
              {shortPersonId}
            </h3>
            
            {/* Stats Row */}
            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon icon={AlertTriangle} className="w-3 h-3" />
                <span>{person.alertCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon icon={Camera} className="w-3 h-3" />
                <span>{person.imageIds.length}</span>
              </div>
            </div>

            {/* Last Seen */}
            <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
              <Icon icon={Calendar} className="w-3 h-3" />
              <span>Last: {formatDateTime(person.lastSeen)}</span>
            </div>

            {/* Alert Level Badge */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-xs">
                {person.alertCount === 1 ? "1 Alert" : `${person.alertCount} Alerts`}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}