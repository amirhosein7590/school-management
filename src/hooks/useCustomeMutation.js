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
  const finalKey = [key, deps ?? null];
  const client = isPrivate ? axiosPrivate : axiosPublic;
  const baseMutation = useMutation({
    mutationKey: finalKey,
    mutationFn: async ({ data, finalUrl }) => {
      try {
        const response = await client[reqType](finalUrl, data, headers && { headers });
        return response.data;
      } catch (error) {

        throw {
          message: error.response?.data?.error || "خطای ناشناخته",
          response: error.response,
          config: error.config,
          toString: () => 'Delete Error'
        };
      }
    },
    onError: (err) => {
      toast.error(err.message)
    },
    throwOnError: false,
    useErrorBoundary: false
  });

  const defaultOnSuccess = (response) => {
    toast.success(response?.message);
    queryClient.invalidateQueries({ queryKey: finalKey });
  };

  const mutate = (data, options = {}) => {
    const { paramId, onSuccess, ...restOptions } = options;
    const finalUrl = paramId ? injectIdToUrl(url, paramId) : url;
    return baseMutation.mutate(
      { data, finalUrl },
      {
        ...restOptions,
        onSuccess: (response, variables, context) => {
          if (!onSuccess) {
            defaultOnSuccess(response);
            return;
          }

          onSuccess(response, variables, context);
        },
      }
    );
  };

  const mutateAsync = (data, options = {}) => {
    const { paramId, onSuccess, ...restOptions } = options;
    const finalUrl = paramId ? injectIdToUrl(url, paramId) : url;
    return baseMutation.mutateAsync(
      { data, finalUrl },
      {
        ...restOptions,
        onSuccess: (response, variables, context) => {
          if (!onSuccess) {
            defaultOnSuccess(response);
            return;
          }

          onSuccess(response, variables, context);
        },
      }
    );
  };

  return {
    ...baseMutation,
    mutate,
    mutateAsync,
  };
}

export default useCustomeMutation;
