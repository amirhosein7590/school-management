export type ParamId = { id: string };
export type MutationOpts<TRes , TReq> = {
    paramId?: ParamId,
      onSuccess?: (resp: TRes, variables: { data: TReq; finalUrl: string }, context: unknown) => void
}