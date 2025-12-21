import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosPublic from "../utils/axiosPublic";
import axiosPrivate from "@/utils/axiosPrivate";
import { toast } from "sonner";

function injectIdToUrl(url, paramId) {
  let finalUrl = url;
  Object.entries(paramId).forEach(([key, value]) => {
    finalUrl = finalUrl.replace(`:${key}`, value);
  });

  return finalUrl;
}

function useCustomeMutation(
  key,
  deps,
  url,
  headers,
  reqType,
  isPrivate = false
) {
  const queryClient = useQueryClient();
  const finalKey = deps ? [key, deps] : [key];
  const client = isPrivate ? axiosPrivate : axiosPublic;
  const baseMutation = useMutation({
    mutationKey: finalKey,
    mutationFn: ({ data, finalUrl }) =>
      client[reqType](finalUrl, data, headers && { headers }).then(
        (res) => res.data
      ),
    onSuccess: (response) => {
      queryClient.invalidateQueries(finalKey);
      toast.success(response?.message);
    },
    onError: (err) => {
      const errorMessage = err.response.data.error;
      toast.error(errorMessage);
    },
  });

  const mutate = (data, options = {}) => {
    const { paramId } = options;
    const finalUrl = paramId ? injectIdToUrl(url, paramId) : url;
    return baseMutation.mutate({ data, finalUrl }, options);
  };

  const mutateAsync = (data, options = {}) => {
    const { paramId } = options;
    const finalUrl = paramId ? injectIdToUrl(url, paramId) : url;
    return baseMutation.mutateAsync({ data, finalUrl }, options);
  };

  return {
    ...baseMutation,
    mutate,
    mutateAsync,
  };
}

export default useCustomeMutation;
