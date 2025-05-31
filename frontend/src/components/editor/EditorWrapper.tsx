import EditorProvider from "@/context/EditorContext";
import { useBlog } from "@/context/BlogContext";
import PageNotFound from "@/pages/404Page";
import DataLoader from "@/shared/loader/DataLoader";
import EditorSwitch from "./EditorSwitch";
import { IEditBlog } from "@/types/blog.type";

const EditorWrapper = () => {
  const { blog, blogId, isErrorBlog, isLoadingBlog } = useBlog();

  if (isErrorBlog) {
    return <PageNotFound />;
  }

  if (isLoadingBlog) {
    return <DataLoader size={35} />;
  }

  const initState: IEditBlog = {
    banner: blog.banner,
    title: blog.title,
    content: blog.content,
    author: blog.author,
    des: blog.des,
    tags: blog.tags,
    draft: false,
  };

  return (
    <EditorProvider blogIdEdit={blogId} initState={initState}>
      <EditorSwitch />
    </EditorProvider>
  );
};

export default EditorWrapper;
