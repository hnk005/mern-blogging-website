import { UserResponse } from "./user.type";

export type Blog = {
  title: string;
  banner: string;
  content: any;
  tags: string[];
  des: string;
  author: {
    profile_img: string;
    fullname: string;
    username: string;
  };
};

export type CreateBlogRequest = {
  title: string;
  banner: string;
  content: any;
  tags: string[];
  des: string;
  draft?: boolean;
};

export type CreateBlogUpdateRequest = CreateBlogRequest & {
  blog_id: string;
};

export type BlogCardResponse = {
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  blog_id: string;
  title: string;
  banner: string;
  des: string;
  tags: string[];
  author: UserResponse;
  publishedAt: string;
};

export type BlogResponse = BlogCardResponse & {
  content: any;
};
