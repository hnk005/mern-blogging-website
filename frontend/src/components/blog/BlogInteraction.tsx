import { useAuth } from "@/context/AuthContext";
import { useBlog } from "@/context/BlogContext";
import paths from "@/routes/paths";
import { Link } from "react-router-dom";

const BlogInteraction = () => {
  const { user } = useAuth();

  const {
    blog: {
      blog_id,
      title,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
  } = useBlog();

  const username = user ? user.username : "";

  return (
    <>
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-heart"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>
        <div className="flex gap-6 items-center">
          {username == author_username && blog_id && (
            <Link
              to={`${paths.editor}/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          )}
          <Link
            to={`http://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
