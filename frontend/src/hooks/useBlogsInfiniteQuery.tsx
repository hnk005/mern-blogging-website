// hooks/useBlogsInfiniteQuery.ts
import axiosClient from "@/config/axios";
import { BlogCardResponse } from "@/types/blog.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBlogParams } from "@/utils/getBlogParams";

type BlogAPIResponse = {
  results: BlogCardResponse[];
  page: number;
  totalDocs: number;
};

type Params = {
  tag: string;
  limit: number;
  search?: string;
  author?: string;
  eliminate_blog?: string;
};

export const useBlogsInfiniteQuery = (params: Params) => {
  return useInfiniteQuery<BlogAPIResponse>({
    queryKey: ["blog", params.tag, params.search, params.author],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get<BlogAPIResponse>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/blog/latest`,
        {
          params: getBlogParams({ pageParam, ...params }),
        }
      );
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.flatMap((p) => p.results).length;
      return totalLoaded < lastPage.totalDocs ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000, 1000 * (attemptIndex + 1)),
  });
};
