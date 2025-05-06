import UserModel, { IUser } from "@/models/User.model";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

export const generateUsername = async (email: string): Promise<string> => {
  let username = email.split("@")[0];

  const isUsernameNotUnique = await UserModel.exists({
    "personal_info.username": username,
  });

  if (isUsernameNotUnique) {
    username += nanoid().substring(0, 5);
  }

  return username;
};

export const formatDataToSend = (user: IUser) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};
