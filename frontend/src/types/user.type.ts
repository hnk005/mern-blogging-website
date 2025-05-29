import { IUser } from "./backend.type";

export interface IUserPersonalInfo
  extends Pick<
    IUser["personal_info"],
    "fullname" | "username" | "profile_img"
  > {}

export interface IAccount {
  access_token: string;
  user: IUserPersonalInfo;
}

export interface IProfile extends Omit<IUser, "google_auth" | "personal_info"> {
  personal_info: IUserPersonalInfo & {
    bio?: string;
  };
}

export interface IUsers {
  personal_info: IUserPersonalInfo;
}
