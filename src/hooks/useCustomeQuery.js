import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../utils/axiosPublic";

function useCustomeQuery(key, deps, url, headers) {
  const finalHeaders = headers ? { headers } : null;
  const finalKey = deps ? [key, deps] : [key];

  return useQuery({
    queryKey: finalKey,
    queryFn: () => axiosPublic.get(url, finalHeaders).then((res) => res.data),
  });
}

export default useCustomeQuery;
