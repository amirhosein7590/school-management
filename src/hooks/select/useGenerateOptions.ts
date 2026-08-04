import { useCustomeInfiniteQuery } from "@/hooks/useCustomeInfiniteQuery";
import { FormRequest } from "@/types/form/request";
import type { Options } from "@/types/select/options";

type TGenerateProp = Options


function useGenerateOptions<TData , TDeps>(options : TGenerateProp) {
    const isEnableQuery = !Array.isArray(options);

    const queryDatas = useCustomeInfiniteQuery<TData , TDeps>({
    enabled : isEnableQuery,
    url : (options as FormRequest).url,
    key : (options as FormRequest).key,
    deps : (options as FormRequest).deps,
    isPrivate : (options as FormRequest).isPrivate,
    headers : (options as FormRequest).headers
    })

    return {optionsData : isEnableQuery ? {...queryDatas , dataArrayName : options.dataArrayName} : options}
}

export default useGenerateOptions