import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { paths } from "@/lib/api-types";

type StatsResponse =
  paths["/api/v1/stats"]["get"]["responses"]["200"]["content"]["application/json"];

const fetchStats = async (): Promise<StatsResponse> => {
  const { data } = await api.get<StatsResponse>("/api/v1/stats");
  return data;
};

export const useGetStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });
};

// We will add more hooks here for alerts, images, etc. as we build more pages.

type StatsOverTimeResponse =
    paths["/api/v1/stats/over-time"]["get"]["responses"]["200"]["content"]["application/json"];

const fetchStatsOverTime = async (days: number): Promise<StatsOverTimeResponse> => {
    const { data } = await api.get<StatsOverTimeResponse>(`/api/v1/stats/over-time?days=${days}`);
    return data;
};

export const useGetStatsOverTime = (days: number = 7) => {
    return useQuery({
        queryKey: ["stats", "over-time", days],
        queryFn: () => fetchStatsOverTime(days),
    });
};

// --- Alerts Hooks ---

type AlertsResponse = paths["/api/v1/alerts"]["get"]["responses"]["200"]["content"]["application/json"];
type AlertFilters = Omit<paths["/api/v1/alerts"]["get"]["parameters"]["query"], "page" | "page_size">;

const fetchAlerts = async ({ pageParam = 1, filters }: { pageParam?: number; filters: AlertFilters }): Promise<AlertsResponse> => {
    const params = new URLSearchParams({
        page: pageParam.toString(),
        page_size: "20",
        ...filters,
    });
    const { data } = await api.get<AlertsResponse>(`/api/v1/alerts?${params.toString()}`);
    return data;
};

export const useGetAlerts = (filters: AlertFilters) => {
    return useInfiniteQuery({
        queryKey: ["alerts", filters],
        queryFn: ({ pageParam }) => fetchAlerts({ pageParam, filters }),
        getNextPageParam: (lastPage, allPages) => {
            // If the last page has fewer items than page_size, we've reached the end.
            if (lastPage.length < 20) return undefined;
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });
};

// --- Images Hooks ---

type ImageMetadataResponse = paths["/api/v1/images/by-image-id/{image_id}"]["get"]["responses"]["200"]["content"]["application/json"];

const fetchImageMetadata = async (imageId: string): Promise<ImageMetadataResponse> => {
    const { data } = await api.get<ImageMetadataResponse>(`/api/v1/images/by-image-id/${imageId}`);
    return data;
};

export const useGetImageMetadata = (imageId: string | null) => {
    return useQuery({
        queryKey: ["imageMetadata", imageId],
        queryFn: () => fetchImageMetadata(imageId!),
        enabled: !!imageId, // Only run the query if imageId is not null
    });
};
