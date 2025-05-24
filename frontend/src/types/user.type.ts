export type PersionInfoResponse = {
  access_token: string;
  profile_img: string;
  fullname: string;
  username: string;
};

export type UserResponse = {
  personal_info: {
    profile_img: string;
    fullname: string;
    username: string;
  };
};

export type ProfileResponse = {
  _id: string;
  personal_info: {
    fullname: string;
    username: string;
    profile_img: string;
    bio: string;
  };
  account_info: {
    total_posts: number;
    total_reads: number;
  };
  social_links: {
    [key: string]: string;
  };
  joinedAt: string;
};
