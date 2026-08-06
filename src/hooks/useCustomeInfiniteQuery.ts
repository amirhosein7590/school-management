import axiosPublic from "@/utils/axiosPublic";
import axiosPrivate from "@/utils/axiosPrivate";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";

export type QueryParams<TData, TDeps> = {
  key: string;
  deps?: TDeps;
  url: string;
  headers?: AxiosRequestHeaders | {};
  isPrivate: boolean;
  enabled: boolean;
  queryOptions?: AxiosRequestConfig<TData>;
  initialData?: {
    [key: string]: unknown;
  };
};

type ServerRes<TData> = TData & {
  totalPages: number;
  currentPage: number;
  [prop: string]: TData[] | number;
};

export function useCustomeInfiniteQuery<TData, TDeps>({
  key,
  deps,
  url,
  headers = {},
  isPrivate = false,
  queryOptions = {},
  enabled = true,
}: QueryParams<TData, TDeps>) {
  const client = isPrivate ? axiosPrivate : axiosPublic;

  const fetchPage = async ({
    pageParam = 1,
  }: { pageParam?: number } = {}): Promise<ServerRes<TData>> => {
    const finalUrl = url.includes("?")
      ? `${url}&page=${pageParam}`
      : `${url}?page=${pageParam}`;
      
    const res = await client.get<ServerRes<TData>>(finalUrl, {
      headers,
      ...queryOptions,
    });
    return (res as AxiosResponse<ServerRes<TData>>).data;
  };

  const queryKey = Array.isArray(key) ? key : [key, deps];

  const result = useInfiniteQuery({
    queryKey,
    queryFn: fetchPage,
    enabled,
    getNextPageParam: (lastPage: ServerRes<TData>) => {
      if (!lastPage) return undefined;
      const current = Number(lastPage.currentPage ?? 1);
      const total = Number(lastPage.totalPages ?? 1);
      return current < total ? current + 1 : undefined;
    },
    initialPageParam: 1,
  });

  return result;
}
