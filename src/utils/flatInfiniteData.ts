type InfiniteData<T, TPageParam> = {
  pages: T[];
  pageParams: TPageParam[];
};



export default function flatDatas<T>(data: InfiniteData<any, any>, dataArrayName: string): T[] {
  const result = () => {
    if (!data?.pages) return [];
    return data.pages.flatMap((p) => p?.[dataArrayName] ?? [])
  };
  return result() as T[];
}
