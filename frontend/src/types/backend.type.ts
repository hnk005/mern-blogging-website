export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  data?: T;
}

export interface IModelPaginate<T> {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface IUser {
  _id: string;
  personal_info: {
    fullname: string;
    email: string;
    password?: string;
    username: string;
    bio?: string;
    profile_img?: string;
  };
  social_links: {
    youtube: string;
    instagram: string;
    facebook: string;
    twitter: string;
    github: string;
    website: string;
  };
  account_info: {
    total_posts: number;
    total_reads: number;
  };
  google_auth: boolean;
  joinedAt: Date;
}

export interface IBlog {
  _id: string;
  blog_id: string;
  title: string;
  banner: string;
  des?: string;
  content: any[];
  tags?: string[];
  author: IUser;
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  draft: boolean;
  publishedAt: Date;
}
