import { callGetBlog } from "@/config/axios";
import { IBlogData } from "@/types/blog.type";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";

interface BlogContextInterface {
  blog: IBlogData;
  blogId: string;
  isLoadingBlog: boolean;
  isErrorBlog: boolean;
}

export const initStateBlog: IBlogData = {
  activity: {
    total_likes: 0,
    total_comments: 0,
    total_reads: 0,
    total_parent_comments: 0,
  },
  blog_id: "",
  title: "",
  banner: "",
  content: [] as any[],
  tags: [] as string[],
  author: {
    personal_info: {
      fullname: "",
      username: "",
      profile_img: "",
    },
  },
  draft: false,
  publishedAt: new Date(),
};

interface BlogProviderProps extends PropsWithChildren {
  blogId: string;
  mode?: "edit" | "view";
}

const BlogContext = createContext({} as BlogContextInterface);

const BlogProvider = ({ children, blogId, mode }: BlogProviderProps) => {
  const {
    data,
    isLoading: isLoadingBlog,
    isError: isErrorBlog,
  } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const response = await callGetBlog(blogId, mode ?? "view");
      return response.data;
    },
    retry: false,
    enabled: !!blogId,
  });

  const blog = useMemo(() => data?.data ?? initStateBlog, [data?.data]);

  return (
    <BlogContext.Provider value={{ blogId, blog, isLoadingBlog, isErrorBlog }}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogProvider;

export const useBlog = () => {
  return useContext(BlogContext);
};
