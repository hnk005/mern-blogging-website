import { createContext, PropsWithChildren, useContext, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { Blog, CreateBlogRequest, UpdateBlogRequest } from "@/types/blog.type";
import axiosClient from "@/config/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "./AuthContext";

interface EditorContextInterface {
  editor: string;
  tagLimit: number;
  characterLimit: number;
  blog: Blog;
  blogIdEdit: string;
  textEditor: EditorJS | { isReady: boolean };
  setTitle: (title: string) => void;
  setBanner: (banner: string) => void;
  setDes: (des: string) => void;
  setEditorJS: (editor: EditorJS) => void;
  setContent: (content: any) => void;
  setEditor: (section: "editor" | "publish") => void;
  setTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  editTag: (tagIndex: number, newTag: string) => void;
  handleSubmit: (draft: boolean) => Promise<void>;
}

const initStateEditorBlog: Blog = {
  title: "",
  banner: "",
  content: [],
  tags: [] as string[],
  des: "",
  author: {
    profile_img: "",
    fullname: "",
    username: "",
  },
};

interface EditorProviderProps extends PropsWithChildren {
  initState?: Blog;
  blogIdEdit?: string;
}

const EditorContext = createContext({} as EditorContextInterface);

const EditorProvider = ({
  children,
  initState = initStateEditorBlog,
  blogIdEdit = "",
}: EditorProviderProps) => {
  const [blog, setBlog] = useState<Blog>(initState);

  const {
    user: { access_token },
  } = useAuth();

  const navigate = useNavigate();

  const [tagLimit] = useState(10);
  const [characterLimit] = useState(200);

  const [editor, setEditor] = useState("editor");
  const [textEditor, setTextEditor] = useState<EditorJS | { isReady: boolean }>(
    { isReady: false }
  );

  const setTitle = (title: string) => {
    setBlog((currentValue) => ({ ...currentValue, title }));
  };

  const setBanner = (banner: string) => {
    setBlog((currentValue) => ({ ...currentValue, banner }));
  };

  const setDes = (des: string) => {
    setBlog((currentValue) => ({ ...currentValue, des }));
  };

  const setEditorJS = (editor: EditorJS) => {
    setTextEditor(editor);
  };

  const setContent = (content: any) => {
    setBlog((currentValue) => ({ ...currentValue, content: content }));
  };

  const setTag = (tag: string) => {
    const { tags } = blog;
    if (tags.length < tagLimit) {
      if (!tags.includes(tag) && tag.length) {
        setBlog((currentValue) => {
          const newTags = [...currentValue.tags, tag];
          return { ...currentValue, tags: newTags };
        });
      }
    }
  };

  const removeTag = (tag: string) => {
    setBlog((currentValue) => {
      const tags = currentValue.tags.filter((t) => t !== tag);
      return { ...currentValue, tags };
    });
  };

  const editTag = (tagIndex: number, newTag: string) => {
    setBlog((currentValue) => {
      const tags = [...currentValue.tags];
      tags[tagIndex] = newTag;
      return { ...currentValue, tags };
    });
  };

  const handleSubmit = async (draft: boolean) => {
    const loading = draft
      ? "Saving as draft..."
      : blogIdEdit
      ? "Upading..."
      : "Publishing...";
    const defaultSuccess = draft
      ? "Draft saved successfully"
      : blogIdEdit
      ? "Blog update successfully"
      : "Blog published successfully";

    const loadingToast = toast.loading(loading);

    let data: CreateBlogRequest | UpdateBlogRequest;
    if (blogIdEdit) {
      data = {
        banner: blog.banner,
        title: blog.title,
        content: blog.content,
        des: blog.des,
        tags: blog.tags,
        blog_id: blogIdEdit,
        draft: draft,
      };
    } else {
      data = {
        banner: blog.banner,
        title: blog.title,
        content: blog.content,
        des: blog.des,
        tags: blog.tags,
        draft: draft,
      };
    }

    try {
      if (!data.title.length) {
        throw `Write blog title before ${
          draft ? "save draft" : blogIdEdit ? "upadate" : "publish"
        }`;
      }

      if (!draft) {
        if (!data.des.length) {
          throw `Write a description about your blog withing ${characterLimit} characters to publish`;
        }

        if (!data.tags.length) {
          throw "Enter at least 1 tag to help us rank your blog";
        }
      }

      let res;
      if (blogIdEdit) {
        res = await axiosClient.put(
          `${import.meta.env.VITE_SERVER_DOMAIN}/blog/update`,
          data,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      } else {
        res = await axiosClient.post(
          `${import.meta.env.VITE_SERVER_DOMAIN}/blog/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      }

      toast.success(res.data?.message || defaultSuccess);
      navigate("/");
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
        return;
      } else if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      } else {
        console.error(error);
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <EditorContext.Provider
      value={{
        tagLimit,
        characterLimit,
        editor,
        blog,
        blogIdEdit,
        textEditor,
        setEditor,
        setTitle,
        setBanner,
        setDes,
        setEditorJS,
        setContent,
        setTag,
        removeTag,
        editTag,
        handleSubmit,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;

export const useEditor = () => {
  return useContext(EditorContext);
};
