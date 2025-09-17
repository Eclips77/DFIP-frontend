"use client";

import { useState } from "react";
import { useGetPeople } from "@/hooks/use-api";
import { PersonCard } from "@/components/person-card";
import { PersonGallery } from "@/components/person-gallery";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Search } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

export default function PeoplePage() {
  const { data: people, isLoading, isError } = useGetPeople();
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter people based on search query
  const filteredPeople = people?.filter(person => 
    person.personId.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">People</h1>
          <p className="text-muted-foreground">
            Browse all detected individuals in the system.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Icon icon={Users} className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">Error Loading People</h1>
        <p className="text-muted-foreground text-center max-w-md">
          There was an error loading the people data. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (!people || people.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Icon icon={Users} className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">No People Found</h1>
        <p className="text-muted-foreground text-center max-w-md">
          No individuals have been detected in the system yet. 
          Check back later as alerts are processed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">People</h1>
          <p className="text-muted-foreground">
            {people.length} individuals detected across all cameras
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Icon icon={Search} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Person ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* People Grid */}
      {filteredPeople.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-4">
          <Icon icon={Search} className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            No people found matching "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPeople.map((person) => (
            <PersonCard
              key={person.personId}
              person={person}
              onClick={() => setSelectedPersonId(person.personId)}
            />
          ))}
        </div>
      )}

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
    </div>
  );
}
