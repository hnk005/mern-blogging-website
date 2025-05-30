import { IBlog } from "./backend.type";

export interface IEditBlog
  extends Omit<
    IBlog,
    "_id" | "activity" | "blog_id" | "author" | "publishedAt"
  > {
  author: {
    personal_info: Pick<
      IBlog["author"]["personal_info"],
      "fullname" | "username" | "profile_img"
    >;
  };
}

export interface IEditBlogData
  extends Omit<
    IBlog,
    "_id" | "activity" | "author" | "blog_id" | "publishedAt"
  > {
  blog_id?: string;
}

export interface IBlogData extends Omit<IBlog, "_id" | "author"> {
  author: {
    personal_info: Pick<
      IBlog["author"]["personal_info"],
      "fullname" | "username" | "profile_img"
    >;
  };
}

export interface IBlogParams {
  tag: string;
  limit: number;
  search?: string;
  author?: string;
  eliminateBlog?: string;
}
