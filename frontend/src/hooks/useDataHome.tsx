import { callGetBlogTrending } from "@/config/axios";
import { useBlogsInfiniteQuery } from "@/hooks/useBlogsInfiniteQuery";
import { useQuery } from "@tanstack/react-query";

const useDataHome = ({
  pageName,
  blogLatestLimit,
}: {
  pageName: string;
  blogLatestLimit: number;
}) => {
  const categories = [
    "home",
    "programming",
    "holywood",
    "film making",
    "social media",
    "cooking",
    "tech",
    "finances",
    "travel",
  ];

  const blogsLatest = useBlogsInfiniteQuery({
    tag: pageName,
    limit: blogLatestLimit,
  });

  const blogsTrending = useQuery({
    queryKey: ["blog/trending"],
    queryFn: async () => {
      const response = await callGetBlogTrending();
      return response.data.data;
    },
    retry: false,
  });

  return {
    categories,
    blogsLatest,
    blogsTrending,
  };
};

export default useDataHome;
