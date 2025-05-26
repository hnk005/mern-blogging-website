import axiosClient from "@/config/axios";
import { BlogResponse } from "@/types/blog.type";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";

interface BlogContextInterface {
  blog: BlogResponse;
  blogId: string;
  isLoadingBlog: boolean;
  isErrorBlog: boolean;
}

const initStateBlog: BlogResponse = {
  activity: {
    total_likes: 0,
    total_comments: 0,
    total_reads: 0,
    total_parent_comments: 0,
  },
  blog_id: "",
  title: "",
  banner: "",
  content: [],
  des: "",
  tags: [],
  author: {
    personal_info: {
      fullname: "",
      username: "",
      profile_img: "",
    },
  },
  publishedAt: "",
};

interface BlogProviderProps extends PropsWithChildren {
  blogId: string;
  mode?: string;
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
      const response = await axiosClient.get<{ blog: BlogResponse }>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/blog/${blogId}`,
        mode ? { params: { draft: false, mode } } : { params: { draft: false } }
      );
      return response.data.blog;
    },
    retry: false,
    enabled: !!blogId,
  });

  const blog = useMemo(() => data ?? initStateBlog, [data]);

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
