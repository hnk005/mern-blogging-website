import { callGetBlogs } from "@/config/axios";
import { IModelPaginate } from "@/types/backend.type";
import { IBlogParams } from "@/types/blog.type";
import { IBlogData } from "@/types/blog.type";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useBlogsInfiniteQuery = (
  params: IBlogParams,
  enabled: boolean = true,
  initPage: number = 1
) => {
  return useInfiniteQuery<IModelPaginate<IBlogData>>({
    queryKey: ["blog", params.tag, params.search ?? "", params.author ?? ""],
    queryFn: async ({ pageParam = initPage }) => {
      const res = await callGetBlogs(pageParam, params);
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.flatMap((p) => p.result).length;
      return totalLoaded < lastPage.meta?.total
        ? lastPage.meta?.page + 1
        : undefined;
    },
    enabled: enabled,
    initialPageParam: initPage,
    retry: false,
  });
};
