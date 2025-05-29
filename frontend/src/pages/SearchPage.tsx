import AnimationWrapper from "@/shared/animation/AnimationWrapper";
import HandleFetch from "@/shared/handler/HandleFetch";
import { callGetUsers } from "@/config/axios";
import BlogCard from "@/components/blog/BlogCard";
import InpageNaviation from "@/components/home/InpageNaviation";
import UserCard from "@/components/user/UserCard";
import { useBlogsInfiniteQuery } from "@/hooks/useBlogsInfiniteQuery";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const SearchPage = () => {
  const { query } = useParams();
  const [blogLimit] = useState(5);
  const [userLimit] = useState(20);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingBlogLatest,
    isError: isErrorBlogLatest,
  } = useBlogsInfiniteQuery(
    {
      tag: "search",
      search: query,
      limit: blogLimit,
    },
    !!query
  );

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useQuery({
    queryKey: ["user", query],
    queryFn: async () => {
      if (!query) {
        return;
      }
      const response = await callGetUsers(query, userLimit);
      return response.data.data;
    },
    retry: false,
    enabled: !!query,
  });

  const searchBlogs = useMemo(
    () => data?.pages.flatMap((page) => page.result) ?? [],
    [data?.pages]
  );

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InpageNaviation
          routes={[`Search results from "${query}"`, "Account Mathed"]}
          defaultHidden="Account Mathed"
        >
          <HandleFetch
            data={searchBlogs}
            isLoading={isLoadingBlogLatest}
            isError={isErrorBlogLatest}
            messageNoData="No searchBlogs published"
          >
            {searchBlogs?.map((blog, i: number) => (
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
            data={users ?? []}
            isLoading={isLoadingUsers}
            isError={isErrorUsers}
            messageNoData="No user found"
          >
            {users?.map((user, i: number) => (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.1 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            ))}
          </HandleFetch>
        </InpageNaviation>
      </div>
      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          User related to search <i className="fi fi-rr-user mt-1"></i>
        </h1>
        <HandleFetch
          data={users ?? []}
          isLoading={isLoadingUsers}
          isError={isErrorUsers}
          messageNoData="No user found"
        >
          {users?.map((user, i: number) => (
            <AnimationWrapper
              key={i}
              transition={{ duration: 1, delay: i * 0.1 }}
            >
              <UserCard user={user} />
            </AnimationWrapper>
          ))}
        </HandleFetch>
      </div>
    </section>
  );
};

export default SearchPage;
