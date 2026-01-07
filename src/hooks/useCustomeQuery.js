import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../utils/axiosPublic";
import axiosPrivate from "@/utils/axiosPrivate";

function useCustomeQuery(
  key,
  deps,
  url,
  headers,
  isPrivate = false,
  options = {},
  enabled = true
) {
  const finalHeaders = headers ? { headers } : null;
  const finalKey = [key, deps ?? null];
  function finalUrl() {
    const { paramId } = options;
    if (!paramId) return url;

    let finalUrl = url;
    Object.entries(paramId).forEach(([key, value]) => {
      finalUrl = finalUrl.replace(key, value);
    });

    return finalUrl;
  }
  const client = isPrivate ? axiosPrivate : axiosPublic;

  return useQuery({
    queryKey: finalKey,
    queryFn: () => client.get(finalUrl(), finalHeaders).then((res) => res.data),
    enabled,
  });
}

export default useCustomeQuery;
