import AnimationWrapper from "@/components/animation/AnimationWrapper";
import defaultBanner from "@/assets/blog banner.png";
import React, { useEffect, useLayoutEffect } from "react";
import toast from "react-hot-toast";
import { uploadImg } from "@/services/cloudinary";
import { useEditor } from "@/context/EditorContext";
import EditorJS from "@editorjs/editorjs";
import tools from "@/utils/editTool";

const BlogEditor = () => {
  const {
    blog: { title, banner, content },
    setTitle,
    setBanner,
    setEditorJS,
  } = useEditor();

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

  useLayoutEffect(() => {
    setEditorJS(
      new EditorJS({
        holder: "textEditor",
        data: content,
        placeholder: "Let's write awesome story",
        tools: tools as any,
      })
    );
  }, []);

  return (
    <AnimationWrapper>
      <section>
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
      </section>
    </AnimationWrapper>
  );
};

export default BlogEditor;
