import registryEntity from "@/utils/registryEntity";
import useCustomeMutation from "../useCustomeMutation";
import { useCallback, useMemo } from "react";

export default function useEntityMutation(entityName, entityId) {
  const config = registryEntity[entityName];
  if (!config) throw new Error(`Unknown entity: ${entityName}`);
  const { url, headers, method, isPrivate, key } = config;

  const finalUrl = () => {
    if (!entityId) return url;
    return url.replace("id", entityId);
  };

  const { isError, isPending, mutate, mutateAsync, data } = useCustomeMutation(
    key,
    null,
    finalUrl(),
    headers,
    method,
    isPrivate,
    config?.table?.dataArrayName
  );

  const handler = useCallback(
    (payload, options) => {
      if (mutateAsync) return mutateAsync(payload, options);
      return mutate(payload, options);
    },
    [mutate, mutateAsync]
  );
  return useMemo(
    () => ({
      mutate: handler,
      isPending,
      isError,
      data,
      config,
    }),
    [handler, isPending, isError, data, config]
  );
}
