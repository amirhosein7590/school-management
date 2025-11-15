import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosPublic from "../../utils/axiosPublic";

function injectIdToUrl(url, paramId) {
  let finalUrl = url;
  Object.entries(paramId).forEach(([key, value]) => {
    finalUrl = finalUrl.replace(`:${key}`, value);
  });

  return finalUrl;
}

function useCustomeMutation(key, deps, url, headers, reqType) {
  const queryClient = useQueryClient();
  const finalKey = deps ? [key, deps] : [key];
  const baseMutation = useMutation({
    mutationKey: finalKey,
    mutationFn: ({ data, finalUrl }) =>
      axiosPublic[reqType](finalUrl, data, headers && { headers }).then(
        (res) => res.data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(finalKey);
    },
    onError: (err) => {
      const errorMessage = err.response.data.error;
      console.log(errorMessage);
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
