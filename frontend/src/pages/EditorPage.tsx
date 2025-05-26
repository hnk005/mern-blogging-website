import BlogProvider from "@/context/BlogContext";
import EditorProvider from "@/context/EditorContext";
import EditorSwitch from "@/feature/editor/EditorSwitch";
import EditorWrapper from "@/feature/editor/EditorWrapper";
import { useParams } from "react-router-dom";

const EditorPage = () => {
  const { blog_id } = useParams();

  if (blog_id) {
    return (
      <BlogProvider blogId={blog_id} mode="edit">
        <EditorWrapper />
      </BlogProvider>
    );
  }
  return (
    <EditorProvider>
      <EditorSwitch />
    </EditorProvider>
  );
};

export default EditorPage;
