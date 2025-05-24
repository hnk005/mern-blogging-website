import axiosClient from "@/config/axios";
import { BlogResponse } from "@/types/blog.type";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";

interface BlogContextInterface {
  blog: BlogResponse;
  isLoadingBlog: boolean;
  isErrorBlog: boolean;
  setBlogId: (id: string) => void;
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

const BlogContext = createContext({} as BlogContextInterface);

const BlogProvider = ({ children }: PropsWithChildren) => {
  const [blog, setBlog] = useState<BlogResponse>(initStateBlog);
  const [blog_id, setBlogId] = useState("");

  const {
    data,
    isLoading: isLoadingBlog,
    isError: isErrorBlog,
  } = useQuery({
    queryKey: ["blog", blog_id],
    queryFn: async () => {
      if (!blog_id) {
        return null;
      }
      const response = await axiosClient.get<{ blog: BlogResponse }>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/blog/${blog_id}`
      );
      return response.data.blog;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000, 1000 * (attemptIndex + 1)),
  });

  useEffect(() => {
    if (data) {
      setBlog(data);
    }
  }, [data]);

  return (
    <BlogContext.Provider
      value={{ blog, isLoadingBlog, isErrorBlog, setBlogId }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogProvider;

export const useBlog = () => {
  return useContext(BlogContext);
};
