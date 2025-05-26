import AnimationWrapper from "@/components/animation/AnimationWrapper";
import { useEditor } from "@/context/EditorContext";
import Tag from "./Tag";

const PublishForm = () => {
  const {
    tagLimit,
    characterLimit,
    blog: { banner, title, des, tags },
    mode,
    setEditor,
    setTitle,
    setDes,
    setTag,
    publishBlog,
    updateBlog,
  } = useEditor();

  const handleCloseEvent = () => {
    setEditor("editor");
  };

  const handleBlogTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    setTitle(input.value);
  };

  const handleDesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target;
    setDes(input.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      const target = e.target as HTMLInputElement;
      const tag = target.value.trim();

      setTag(tag);
      target.value = "";
    }
  };

  const handlePublish = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;

    if (button.classList.contains("disable")) {
      return;
    }

    button.classList.add("disable");

    try {
      switch (mode) {
        case "create":
          await publishBlog(false);
          break;
        case "edit":
          await updateBlog(false);
          break;
        default:
          break;
      }
    } finally {
      button.classList.remove("disable");
    }
  };

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <button
          onClick={handleCloseEvent}
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%]"
        >
          <i className="fi fi-br-cross"></i>
        </button>
        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} alt="" />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {des}
          </p>
        </div>
        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            onChange={handleBlogTitleChange}
            className="input-box pl-4"
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
          />
          <p className="text-dark-grey mb-2 mt-9">
            Short description about your blog
          </p>
          <textarea
            maxLength={characterLimit}
            defaultValue={des}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handleDesChange}
          />
          <p className="mt-1 text-dark-grey text-sm text-right">
            {characterLimit - des.length} characters left
          </p>
          <p className="text-dark-grey mb-2 mt-9">
            Topic - ( Helps is searching and ranking your blog post)
          </p>
          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Topic"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleKeyDown}
            />
            {tags.map((tag, index) => (
              <Tag tag={tag} tagIndex={index} key={index} />
            ))}
          </div>
          <p className="mt-1 mb-4 text-dark-grey text-sm text-right">
            {tagLimit - tags.length} Tags left
          </p>
          <button onClick={handlePublish} className="btn-dark px-8">
            {mode == "create" ? "Publish" : "Update"}
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
