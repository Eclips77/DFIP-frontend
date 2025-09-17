
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import api from "@/lib/api-client";
import { operations, paths } from "@/lib/api-types";

// --- Stats ---

type StatsApiResponse =
  paths["/api/v1/stats"]["get"]["responses"]["200"]["content"]["application/json"];

export type StatsResponse = {
  totalAlerts: number;
  alerts24h: number;
  distinctPeople: number;
  activeCameras: number;
};

const normalizeStats = (payload: StatsApiResponse): StatsResponse => {
  const record = payload as Record<string, unknown>;

  return {
    totalAlerts:
      (record["totalAlerts"] as number | undefined) ??
      (record["total_alerts"] as number | undefined) ??
      0,
    alerts24h:
      (record["alerts24h"] as number | undefined) ??
      (record["alerts_24h"] as number | undefined) ??
      0,
    distinctPeople:
      (record["distinctPeople"] as number | undefined) ??
      (record["distinct_people"] as number | undefined) ??
      0,
    activeCameras:
      (record["activeCameras"] as number | undefined) ??
      (record["active_cameras"] as number | undefined) ??
      0,
  };
};

const fetchStats = async (): Promise<StatsResponse> => {
  const { data } = await api.get<StatsApiResponse>("/api/v1/stats");
  return normalizeStats(data);
};

export const useGetStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });
};

// --- Stats Over Time ---

type StatsOverTimeApiResponse =
  paths["/api/v1/stats/over-time"]["get"]["responses"]["200"]["content"]["application/json"];

export type StatsOverTimeResponse = Array<{
  timeBucket: string;
  count: number;
}>;

const normalizeTimeSeries = (
  point: StatsOverTimeApiResponse[number]
): StatsOverTimeResponse[number] => {
  const record = point as Record<string, unknown>;

  return {
    timeBucket:
      (record["timeBucket"] as string | undefined) ??
      (record["_id"] as string | undefined) ??
      "",
    count: (record["count"] as number | undefined) ?? 0,
  };
};

const fetchStatsOverTime = async (days: number): Promise<StatsOverTimeResponse> => {
  const { data } = await api.get<StatsOverTimeApiResponse>(
    "/api/v1/stats/over-time?days=" + days
  );
  return data.map(normalizeTimeSeries);
};

export const useGetStatsOverTime = (days: number = 7) => {
  return useQuery({
    queryKey: ["stats", "over-time", days],
    queryFn: () => fetchStatsOverTime(days),
  });
};

// --- Alerts ---

type AlertsApiResponse =
  paths["/api/v1/alerts"]["get"]["responses"]["200"]["content"]["application/json"];

type AlertQueryParams =
  operations["list_alerts_api_v1_alerts_get"]["parameters"]["query"];

export type AlertFilters =
  Partial<Omit<NonNullable<AlertQueryParams>, "page">>;

export type Alert = {
  id: string;
  personId: string;
  time: string;
  level: "alert" | "info" | "warning";
  imageId: string | null;
  cameraId: string;
  message: string;
};

const normalizeAlert = (alert: AlertsApiResponse[number]): Alert => {
  const record = alert as Record<string, unknown>;

  return {
    id:
      (record["id"] as string | undefined) ??
      (record["_id"] as string | undefined) ??
      "",
    personId:
      (record["personId"] as string | undefined) ??
      (record["person_id"] as string | undefined) ??
      "",
    time: (record["time"] as string | undefined) ?? "",
    level: (record["level"] as Alert["level"] | undefined) ?? "info",
    imageId:
      (record["imageId"] as string | undefined) ??
      (record["image_id"] as string | undefined) ??
      null,
    cameraId:
      (record["cameraId"] as string | undefined) ??
      (record["camera_id"] as string | undefined) ??
      "",
    message: (record["message"] as string | undefined) ?? "",
  };
};

const fetchAlerts = async ({
  pageParam = 1,
  filters = {},
}: {
  pageParam?: number;
  filters?: AlertFilters;
}): Promise<Alert[]> => {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    page_size: "20",
  });

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const { data } = await api.get<AlertsApiResponse>(
    "/api/v1/alerts?" + params.toString()
  );

  return data.map(normalizeAlert);
};

export const useGetAlerts = (filters: AlertFilters = {}) => {
  return useInfiniteQuery<
    Alert[],
    unknown,
    import("@tanstack/react-query").InfiniteData<Alert[], number>,
    [string, AlertFilters],
    number
  >({
    queryKey: ["alerts", filters] as const,
    queryFn: ({ pageParam = 1 }) => fetchAlerts({ pageParam, filters }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
};

// --- Images ---

type ImageMetadataApiResponse =
  paths["/api/v1/images/by-image-id/{image_id}"]["get"]["responses"]["200"]["content"]["application/json"];

export type ImageMetadataResponse = {
  id: string;
  metadata: {
    imageId: string;
    eventTs: string;
    [key: string]: unknown;
  };
  chunkSize: number;
  length: number;
  uploadDate: string;
  filename: string;
};

const normalizeImageMetadata = (
  payload: ImageMetadataApiResponse
): ImageMetadataResponse => {
  const record = payload as Record<string, unknown>;

  const rawMetadata = (record["metadata"] ?? {}) as Record<string, unknown>;

  return {
    id:
      (record["id"] as string | undefined) ??
      (record["_id"] as string | undefined) ??
      "",
    metadata: {
      ...rawMetadata,
      imageId:
        (rawMetadata["imageId"] as string | undefined) ??
        (rawMetadata["image_id"] as string | undefined) ??
        "",
      eventTs:
        (rawMetadata["eventTs"] as string | undefined) ??
        (rawMetadata["event_ts"] as string | undefined) ??
        "",
    },
    chunkSize:
      (record["chunkSize"] as number | undefined) ??
      (record["chunk_size"] as number | undefined) ??
      0,
    length: (record["length"] as number | undefined) ?? 0,
    uploadDate:
      (record["uploadDate"] as string | undefined) ??
      (record["upload_date"] as string | undefined) ??
      "",
    filename: (record["filename"] as string | undefined) ?? "",
  };
};

const fetchImageMetadata = async (
  imageId: string
): Promise<ImageMetadataResponse> => {
  const { data } = await api.get<ImageMetadataApiResponse>(
    "/api/v1/images/by-image-id/" + imageId
  );
  return normalizeImageMetadata(data);
};

export const useGetImageMetadata = (imageId: string | null) => {
  return useQuery({
    queryKey: ["imageMetadata", imageId],
    queryFn: () => fetchImageMetadata(imageId!),
    enabled: !!imageId,
  });
};
