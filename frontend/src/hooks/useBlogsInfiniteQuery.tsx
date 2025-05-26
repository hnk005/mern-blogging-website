import axiosClient from "@/config/axios";
import { BlogCardResponse } from "@/types/blog.type";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  eliminateBlog?: string;
};

type HandleParamsInput = Params & {
  page: number | any;
};

const getBlogParams = ({
  page,
  tag,
  search,
  limit,
  author,
  eliminateBlog,
}: HandleParamsInput) => {
  switch (tag) {
    case "search":
      return { search, page, limit };
    case "home":
      return { page, limit };
    case "profile":
      return { page, limit, author };
    default:
      if (eliminateBlog) {
        return { tag, page, limit, eliminate_blog: eliminateBlog };
      } else {
        return { tag, page, limit };
      }
  }
};

export const useBlogsInfiniteQuery = (
  params: Params,
  enabled: boolean = true,
  initPage: number = 1
) => {
  return useInfiniteQuery<BlogAPIResponse>({
    queryKey: ["blog", params.tag, params.search ?? "", params.author ?? ""],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosClient.get<BlogAPIResponse>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/blog/latest`,
        {
          params: getBlogParams({ page: pageParam, ...params }),
        }
      );
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.flatMap((p) => p.results).length;
      return totalLoaded < lastPage.totalDocs ? lastPage.page + 1 : undefined;
    },
    enabled: enabled,
    initialPageParam: initPage,
    retry: false,
  });
};
