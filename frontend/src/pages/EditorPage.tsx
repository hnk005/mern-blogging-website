import Navbar from "@/components/layout/editor-layout/Navbar";
import BlogProvider from "@/context/BlogContext";
import { useEditor } from "@/context/EditorContext";
import BlogEditor from "@/feature/editor/BlogEditor";
import PublishForm from "@/feature/editor/PublishForm";

const EditorPage = () => {
  const { editor } = useEditor();

  return editor == "editor" ? (
    <>
      <Navbar />
      <BlogProvider>
        <BlogEditor />
      </BlogProvider>
    </>
  ) : (
    <PublishForm />
  );
};

export default EditorPage;
