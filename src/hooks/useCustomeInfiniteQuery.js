import axiosPrivate from "@/utils/axiosPrivate";
import axiosPublic from "@/utils/axiosPublic";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useCustomeInfiniteQuery(
  key,
  deps,
  url,
  headers = null,
  isPrivate = false,
  queryOptions = {},
  enabled = true
) {
  const client = isPrivate ? axiosPrivate : axiosPublic;

  const fetchPage = async ({ pageParam = 1, signal } = {}) => {
    const params = { page: pageParam, ...(queryOptions.params || {}) };
    const res = await client.get(url, { params, signal });
    return res.data;
  };

  const queryKey = Array.isArray(key) ? key : [key, deps];

  const result = useInfiniteQuery({
    queryKey,
    queryFn: fetchPage,
    enabled,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const current = Number(lastPage.currentPage ?? lastPage.page ?? 1);
      const total = Number(lastPage.totalPages ?? lastPage.total ?? 1);
      return current < total ? current + 1 : undefined;
    },
  });

  return result;
}
