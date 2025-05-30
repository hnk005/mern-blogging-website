import Navbar from "@/shared/layout/editor-layout/Navbar";
import { useEditor } from "@/context/EditorContext";
import EditorBlog from "./EditorBlog";
import PublishForm from "./PublishForm";

const EditorSwitch = () => {
  const { editor } = useEditor();
  return editor == "editor" ? (
    <>
      <Navbar />
      <EditorBlog />
    </>
  ) : (
    <PublishForm />
  );
};

export default EditorSwitch;
