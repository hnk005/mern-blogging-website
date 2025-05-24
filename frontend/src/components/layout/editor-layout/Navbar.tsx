import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useEditor } from "@/context/EditorContext";
import toast from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
const Navbar = () => {
  const {
    blog: { banner, title },
    textEditor,
    setEditor,
    setContent,
    publishBlog,
  } = useEditor();

  const handlePublish = async () => {
    try {
      if (!banner) {
        throw "Upload a blog banner to publish it";
      }

      if (!title) {
        throw "Write blog title to publish it";
      }

      const textE = textEditor as EditorJS;
      await textE.isReady;
      const data = await textE.save();
      if (data.blocks.length) {
        setContent(data);
        setEditor("publish");
      } else {
        throw "Write something in your blog to publish it";
      }
    } catch (error) {
      if (typeof error == "string") {
        return toast.error(error);
      }
      console.log(error);
    }
  };

  const handleSaveDraft = async () => {
    await publishBlog(true);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="flex-none w-10">
        <img src={logo} className="w-full" />
      </Link>
      <p className="max-md:hidden text-black line-clamp-1 w-full">
        {title != "" ? title : "New Blog"}
      </p>
      <div className="flex gap-4 ml-auto">
        <button onClick={handlePublish} className="btn-dark py-2">
          Publish
        </button>
        <button onClick={handleSaveDraft} className="btn-light py-2">
          Save Draft
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
