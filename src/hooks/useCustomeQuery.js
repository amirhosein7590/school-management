import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../utils/axiosPublic";
import axiosPrivate from "@/utils/axiosPrivate";

function useCustomeQuery(key, deps, url, headers, isPrivate = false) {
  const finalHeaders = headers ? { headers } : null;
  const finalKey = deps ? [key, deps] : [key];
  const client = isPrivate ? axiosPrivate : axiosPublic;

  return useQuery({
    queryKey: finalKey,
    queryFn: () => client.get(url, finalHeaders).then((res) => res.data),
  });
}

export default useCustomeQuery;
