import UserModel, { IUser } from "@/models/User.model";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";

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

export const generateAccessToken = (userId: string) => {
  const accessTokenExistTime: number | StringValue =
    process.env.ACCESS_TOKEN_EXPIRESIN ?? "30m";

  const accessToken = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
    expiresIn: accessTokenExistTime,
  });

  return accessToken;
};

export const generateRefreshToken = (userId: string) => {
  const refreshTokenExistTime: number | StringValue =
    process.env.REFRESH_TOKEN_EXPIRESIN ?? "3d";

  const refreshToken = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
    expiresIn: refreshTokenExistTime,
  });

  return refreshToken;
};
