type HandleParamsInput = {
  pageParam: number | any;
  tag: string;
  search?: string;
  limit: number;
  author?: string;
  eliminate_blog?: string;
};

export const getBlogParams = ({
  pageParam,
  tag,
  search,
  limit,
  author,
  eliminate_blog,
}: HandleParamsInput) => {
  switch (tag) {
    case "search":
      return { search, page: pageParam, limit };
    case "home":
      return { page: pageParam, limit };
    case "userBlogs":
      return { page: pageParam, limit, author };
    default:
      return { tag, page: pageParam, limit, eliminate_blog };
  }
};
