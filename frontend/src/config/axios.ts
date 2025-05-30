import axiosCustom from "./axios-customize";
import { IBackendRes, IModelPaginate } from "@/types/backend.type";
import { IBlogData, IEditBlogData, IBlogParams } from "@/types/blog.type";
import {
  IAccessTokenResponse,
  IAccount,
  IProfile,
  IUserPersonalInfo,
  IUsers,
} from "@/types/user.type";
import { getBlogParams } from "@/utils/getParamBlog";

export const callSignUp = (
  fullname: string,
  email: string,
  password: string
) => {
  return axiosCustom.post<IBackendRes<"">>("/auth/sign-up", {
    fullname,
    email,
    password,
  });
};

export const callSignIn = (email: string, password: string) => {
  return axiosCustom.post<IBackendRes<IAccount>>("/auth/sign-in", {
    email,
    password,
  });
};

export const callSignInWithGoogle = (accessToken: string) => {
  return axiosCustom.post<IBackendRes<IAccount>>("/auth/google-auth", {
    access_token: accessToken,
  });
};

export const callSignOut = () => {
  return axiosCustom.post<IBackendRes<IAccount>>("/auth/sign-out");
};

export const callRefreshToken = () => {
  return axiosCustom.get<IBackendRes<IAccessTokenResponse>>(
    "/auth/refresh-token"
  );
};

export const callMe = () => {
  return axiosCustom.get<IBackendRes<IUserPersonalInfo>>("/auth/me");
};

export const callCreateBlog = (data: IEditBlogData) => {
  return axiosCustom.post<IBackendRes<"">>("/blog/create", data);
};

export const callUpdateBlog = (data: IEditBlogData) => {
  return axiosCustom.put<IBackendRes<"">>(`/blog/update`, data);
};

export const callGetBlog = (blogId: string, mode: "edit" | "view") => {
  return axiosCustom.get<IBackendRes<IBlogData>>(`/blog/${blogId}`, {
    params: { draft: false, mode },
  });
};

export const callGetBlogs = (pageCurrent: any, params: IBlogParams) => {
  return axiosCustom.get<IModelPaginate<IBlogData>>("/blog/latest", {
    params: getBlogParams({ page: pageCurrent, ...params }),
  });
};

export const callGetBlogTrending = () => {
  return axiosCustom.get<IBackendRes<IBlogData[]>>("/blog/trending");
};

export const callGetUsers = (username: string, limit: number) => {
  return axiosCustom.get<IBackendRes<IUsers[]>>("/user/search", {
    params: { username, limit },
  });
};

export const callGetProfileUser = (userId: string) => {
  return axiosCustom.get<IBackendRes<IProfile>>(`user/profile/${userId}`);
};
