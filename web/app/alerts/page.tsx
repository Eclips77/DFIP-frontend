"use client";

import { useState } from "react";
import { AlertsTable } from "@/components/alerts-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AlertsPage() {
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [messageSearch, setMessageSearch] = useState<string | undefined>(undefined);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">
          Browse and filter all recorded alerts from the system.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by message..."
          className="max-w-sm"
          onChange={(e) => setMessageSearch(e.target.value)}
        />
        <Select onValueChange={(value) => setLevel(value === "all" ? undefined : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="alert">Alert</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AlertsTable level={level} messageSearch={messageSearch} />
    </div>
  );
}
