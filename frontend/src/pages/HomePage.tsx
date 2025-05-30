import AnimationWrapper from "@/shared/animation/AnimationWrapper";
import HandleFetch from "@/shared/handler/HandleFetch";
import BlogCard from "@/components/blog/BlogCard";
import MinimalBlogPost from "@/components/blog/MinimalBlogPost";
import InpageNaviation from "@/components/home/InpageNaviation";
import clsx from "clsx";
import { useMemo, useState } from "react";
import useDataHome from "@/hooks/useDataHome";

const HomePage = () => {
  const [pageName, setPageName] = useState("home");
  const [blogsLatestLimit] = useState(5);

  const {
    categories,
    blogsLatest: {
      data: blogsLatestData,
      isLoading: isLoadingBlogLatest,
      isError: isErrorBlogLatest,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
      refetch: refetchBlogsLatest,
    },
    blogsTrending: {
      data: blogsTrendingData,
      isLoading: isLoadingBlogTrending,
      isError: isErrorBlogTrending,
      refetch: refetchBlogsTreding,
    },
  } = useDataHome({ pageName, blogLatestLimit: blogsLatestLimit });

  const blogsLatest = useMemo(
    () => blogsLatestData?.pages.flatMap((page) => page.result) ?? [],
    [blogsLatestData?.pages]
  );

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
              refetch={refetchBlogsLatest}
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
              data={blogsTrendingData}
              isLoading={isLoadingBlogTrending}
              isError={isErrorBlogTrending}
              refetch={refetchBlogsTreding}
              messageNoData="No blogs trending"
            >
              {blogsTrendingData?.map((blog, i: number) => (
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
                data={blogsTrendingData}
                isLoading={isLoadingBlogTrending}
                isError={isErrorBlogTrending}
                refetch={refetchBlogsTreding}
                messageNoData="No blogs trending"
              >
                {blogsTrendingData?.map((blog, i: number) => (
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
