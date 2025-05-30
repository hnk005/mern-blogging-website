import { IBlogData } from "@/types/blog.type";
import { getDay } from "@/utils/formatDate";
import { Link } from "react-router-dom";

interface MinimalBlogPostInterface {
  data: IBlogData;
  index: number;
}

const MinimalBlogPost = ({ data, index }: MinimalBlogPostInterface) => {
  const {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
  } = data;

  const publishedAt = data.publishedAt ?? "";

  return (
    <Link to={`/blog/${id}`} className="flex gap-5 mb-8">
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>
      <div>
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} className="w-6 h-6 rounded-full" alt="" />
          <p className="line-clamp-1">
            {fullname}@{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
