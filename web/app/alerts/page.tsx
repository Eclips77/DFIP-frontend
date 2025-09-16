import { AlertsTable } from "@/components/alerts-table";

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">
          Browse and filter all recorded alerts.
        </p>
      </div>
      <AlertsTable />
    </div>
  );
}
