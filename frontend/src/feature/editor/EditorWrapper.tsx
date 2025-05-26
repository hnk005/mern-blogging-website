import EditorProvider from "@/context/EditorContext";
import { useBlog } from "@/context/BlogContext";
import PageNotFound from "@/pages/404Page";
import DataLoader from "@/components/loader/DataLoader";
import { Blog } from "@/types/blog.type";
import EditorSwitch from "./EditorSwitch";

const EditorWrapper = () => {
  const { blog, blogId, isErrorBlog, isLoadingBlog } = useBlog();

  if (isErrorBlog) {
    return <PageNotFound />;
  }

  if (isLoadingBlog) {
    return <DataLoader size={35} />;
  }

  const initState: Blog = {
    banner: blog.banner,
    title: blog.title,
    content: blog.content,
    author: blog.author.personal_info,
    des: blog.des,
    tags: blog.tags,
  };

  return (
    <EditorProvider blogIdEdit={blogId} initState={initState}>
      <EditorSwitch />
    </EditorProvider>
  );
};

export default EditorWrapper;
