import { IUser } from "@/models/User.model";

type FormatDataResponseParams = {
  message: string;
  data?: any;
  error?: string | string[];
};

export const formatDataToSendUser = (user: IUser) => {
  return {
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

export const formatDataResponse = ({
  message,
  data,
  error,
}: FormatDataResponseParams) => {
  return {
    message,
    data,
    error,
  };
};
