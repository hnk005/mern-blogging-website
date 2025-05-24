import Navbar from "@/components/layout/editor-layout/Navbar";
import { useEditor } from "@/context/EditorContext";
import BlogEditor from "@/feature/editor/BlogEditor";
import PublishForm from "@/feature/editor/PublishForm";

const EditorPage = () => {
  const { editor } = useEditor();

  return editor == "editor" ? (
    <>
      <Navbar />
      <BlogEditor />
    </>
  ) : (
    <PublishForm />
  );
};

export default EditorPage;
