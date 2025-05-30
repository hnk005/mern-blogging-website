import { IBlogParams } from "@/types/blog.type";

type HandleParamsInput = IBlogParams & {
  page: number | any;
};

export const getBlogParams = ({
  page,
  tag,
  search,
  limit,
  author,
  eliminateBlog,
}: HandleParamsInput) => {
  switch (tag) {
    case "search":
      return { search, page, limit };
    case "home":
      return { page, limit };
    case "profile":
      return { page, limit, author };
    default:
      if (eliminateBlog) {
        return { tag, page, limit, eliminate_blog: eliminateBlog };
      } else {
        return { tag, page, limit };
      }
  }
};
