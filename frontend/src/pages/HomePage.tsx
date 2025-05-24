import AnimationWrapper from "@/components/animation/AnimationWrapper";
import HandleFetch from "@/components/handler/HandleFetch";
import axiosClient from "@/config/axios";
import BlogCard from "@/feature/blog/BlogCard";
import MinimalBlogPost from "@/feature/blog/MinimalBlogPost";
import InpageNaviation from "@/feature/home/InpageNaviation";
import { useBlogsInfiniteQuery } from "@/hooks/useBlogsInfiniteQuery";
import { BlogCardResponse } from "@/types/blog.type";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useMemo, useState } from "react";

const HomePage = () => {
  const categories = [
    "programming",
    "holywood",
    "film making",
    "social media",
    "cooking",
    "tech",
    "finances",
    "travel",
  ];

  const [pageName, setPageName] = useState("home");
  const [limit] = useState(2);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingBlogLatest,
    isError: isErrorBlogLatest,
  } = useBlogsInfiniteQuery({ pageName: pageName, limit: limit });

  const blogsLatest = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data?.pages]
  );

  const {
    data: blogsTrending,
    isLoading: isLoadingBlogTrending,
    isError: isErrorBlogTrending,
  } = useQuery({
    queryKey: ["blog/trending"],
    queryFn: async () => {
      const response = await axiosClient.get<{ blogs: BlogCardResponse[] }>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/blog/trending`
      );
      return response.data.blogs;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000, 1000 * (attemptIndex + 1)),
  });

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest posts */}
        <div className="w-full">
          <InpageNaviation
            routes={[pageName, "trending blogs"]}
            defaultHidden="trending blogs"
          >
            <HandleFetch
              data={blogsLatest}
              isLoading={isLoadingBlogLatest}
              isError={isErrorBlogLatest}
              messageNoData="No blogs published"
            >
              {blogsLatest?.map((blog, i: number) => (
                <AnimationWrapper
                  key={i}
                  transition={{ duration: 1, delay: i * 0.1 }}
                >
                  <BlogCard data={blog} />
                </AnimationWrapper>
              ))}
              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </button>
              )}
            </HandleFetch>

            <HandleFetch
              data={blogsTrending ?? []}
              isLoading={isLoadingBlogTrending}
              isError={isErrorBlogTrending}
              messageNoData="No blogs trending"
            >
              {blogsTrending?.map((blog, i: number) => (
                <AnimationWrapper
                  key={i}
                  transition={{ duration: 1, delay: i * 0.1 }}
                >
                  <MinimalBlogPost data={blog} index={i} />
                </AnimationWrapper>
              ))}
            </HandleFetch>
          </InpageNaviation>
        </div>

        {/* fillers and trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories form all interests
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => (
                  <button
                    onClick={() => setPageName(category)}
                    key={i}
                    className={clsx(
                      "tag",
                      pageName == category ? "bg-black text-white" : ""
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              <HandleFetch
                data={blogsTrending ?? []}
                isLoading={isLoadingBlogTrending}
                isError={isErrorBlogTrending}
                messageNoData="No blogs trending"
              >
                {blogsTrending?.map((blog, i: number) => (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <MinimalBlogPost data={blog} index={i} />
                  </AnimationWrapper>
                ))}
              </HandleFetch>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
