type HandleParamsInput = {
  pageParam: number | any;
  pageName: string;
  search?: string;
  limit: number;
  author?: string;
};

export const getBlogParams = ({
  pageParam,
  pageName,
  search,
  limit,
  author,
}: HandleParamsInput) => {
  switch (pageName) {
    case "search":
      return { search, page: pageParam, limit };
    case "home":
      return { page: pageParam, limit };
    case "userBlogs":
      return { page: pageParam, limit, author };
    default:
      return { tag: pageName, page: pageParam, limit };
  }
};
