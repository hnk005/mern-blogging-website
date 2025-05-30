import { Link } from "react-router-dom";
import BlogContent from "./BlogContent";
import BlogInteraction from "./BlogInteraction";
import HandleFetch from "@/shared/handler/HandleFetch";
import AnimationWrapper from "@/shared/animation/AnimationWrapper";
import BlogCard from "./BlogCard";
import { useBlog } from "@/context/BlogContext";
import { useBlogsInfiniteQuery } from "@/hooks/useBlogsInfiniteQuery";
import { useMemo, useState } from "react";
import PageNotFound from "@/pages/404Page";
import DataLoader from "@/shared/loader/DataLoader";
import paths from "@/routes/paths";
import { getDay } from "@/utils/formatDate";

const BlogWrapper = () => {
  const { blogId, blog, isErrorBlog, isLoadingBlog } = useBlog();
  const [limitSimilarBlog] = useState(6);

  const {
    title,
    content,
    banner,
    tags,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const {
    data,
    isLoading: isLoadingSimilarBlog,
    isError: isErrorSimilarBlog,
  } = useBlogsInfiniteQuery({
    tag: tags ? tags[0] : "",
    limit: limitSimilarBlog,
    eliminateBlog: blogId,
  });

  const similarBlogs = useMemo(
    () => data?.pages.flatMap((page) => page.result) ?? [],
    [data?.pages]
  );

  if (isErrorBlog) {
    return <PageNotFound />;
  }

  if (isLoadingBlog) {
    return <DataLoader size={35} />;
  }

  return (
    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
      <img src={banner} alt="" />
      <div className="mt-12">
        <h2>{title}</h2>
        <div className="flex max-sm:flex-col justify-between my-8">
          <div className="flex gap-5 items-start ">
            <img src={profile_img} alt="" className="w-12 h-12 rounded-full" />
            <p className="capitalize">
              {fullname} <br /> @
              <Link to={`${paths.user}/${author_username}`}>
                {author_username}
              </Link>
            </p>
          </div>
          <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
            Published on {getDay(publishedAt)}
          </p>
        </div>
      </div>
      <BlogInteraction />
      <div className="my-12 font-gelasio blog-page-content">
        {content[0]?.blocks?.map((block: any, i: number) => (
          <div key={i} className="my-4 md:my-8">
            <BlogContent block={block} />
          </div>
        ))}
      </div>
      <BlogInteraction />

      <HandleFetch
        data={similarBlogs}
        isLoading={isLoadingSimilarBlog}
        isError={isErrorSimilarBlog}
      >
        <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>
        {similarBlogs.map((blog, i) => (
          <AnimationWrapper
            key={i}
            transition={{ duration: 1, delay: i * 0.1 }}
          >
            <BlogCard data={blog} />
          </AnimationWrapper>
        ))}
      </HandleFetch>
    </div>
  );
};

export default BlogWrapper;
