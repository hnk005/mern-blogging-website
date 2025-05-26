import AnimationWrapper from "@/components/animation/AnimationWrapper";
import defaultBanner from "@/assets/blog banner.png";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { uploadImg } from "@/services/cloudinary";
import { useEditor } from "@/context/EditorContext";
import EditorJS from "@editorjs/editorjs";
import tools from "@/utils/editTool";
import { useBlog } from "@/context/BlogContext";
import { useParams } from "react-router-dom";
import PageNotFound from "@/pages/404Page";
import DataLoader from "@/components/loader/DataLoader";

const BlogEditor = () => {
  const {
    blog: { title, banner, content },
    textEditor,
    setBlogIdUpdate,
    setMode,
    setTitle,
    setBanner,
    setDes,
    setTag,
    setEditorJS,
  } = useEditor();

  const { blog_id } = useParams();
  const { blog, isErrorBlog, isLoadingBlog, setBlogId } = useBlog();

  const {
    title: titleEdit,
    content: contentEdit,
    banner: bannerEdit,
    tags,
    des,
  } = blog;

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const loadingToast = toast.loading("Uploading...");
    try {
      if (file) {
        setBanner(await uploadImg(file));
        toast.success("Upload successfully");
      }
      return;
    } catch (err) {
      toast.error("Upload image failed");
      console.log(err);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setTitle(input.value);
  };

  const handleErrorImg = (e: React.ChangeEvent<HTMLImageElement>) => {
    const img = e.target;

    img.src = defaultBanner;
  };

  useEffect(() => {
    if (textEditor.isReady && contentEdit[0]) {
      const text = textEditor as EditorJS;
      text.isReady.then(() => {
        text.render(contentEdit[0]);
      });
    }
  }, [textEditor, contentEdit]);

  useEffect(() => {
    if (bannerEdit) {
      setBanner(bannerEdit);
    }
    if (titleEdit) {
      setTitle(titleEdit);
    }
    if (des) {
      setDes(des);
    }
    if (tags) {
      tags.forEach((tag) => {
        setTag(tag);
      }, []);
    }
  }, [blog]);

  useEffect(() => {
    if (blog_id) {
      setBlogId(blog_id);
      setMode("edit");
      setBlogIdUpdate(blog_id);
    }
  }, [blog_id]);

  useEffect(() => {
    if (!isLoadingBlog) {
      setEditorJS(
        new EditorJS({
          holder: "textEditor",
          data: content,
          placeholder: "Let's write awesome story",
          tools: tools as any,
        })
      );
    }
  }, [isLoadingBlog]);

  if (isErrorBlog) {
    return <PageNotFound />;
  }

  return (
    <AnimationWrapper>
      <section>
        {isLoadingBlog ? (
          <DataLoader size={35} />
        ) : (
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  src={banner == "" ? defaultBanner : banner}
                  alt=""
                  className="z-20"
                  onError={handleErrorImg}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
            <textarea
              defaultValue={title}
              onChange={handleTitleChange}
              onKeyDown={handleTitleKeyDown}
              placeholder="Blog title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
            />
            <hr className="w-full opacity-10 my-5"></hr>
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        )}
      </section>
    </AnimationWrapper>
  );
};

export default BlogEditor;
