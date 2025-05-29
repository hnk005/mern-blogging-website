import { callSignIn, callSignInWithGoogle, callSignUp } from "@/config/axios";
import { authWithGoogle } from "@/services/firebase";
import {
  lookInSession,
  removeFromSession,
  storeInSession,
} from "@/services/session";
import { IAccount, IUserPersonalInfo } from "@/types/user.type";
import { handleApiRequest } from "@/utils/handleApi";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { globalLoading } from "react-global-loading";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextInterface {
  user: IUserPersonalInfo;
  signUp: (fullname: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  googleAuth: () => Promise<void>;
  signOut: () => void;
  isAuth: () => boolean;
}

const initStateUser = {
  profile_img: "",
  fullname: "",
  username: "",
};

const AuthContext = createContext({} as AuthContextInterface);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<IUserPersonalInfo>(
    lookInSession("user") || initStateUser
  );

  const { show, hide } = globalLoading;
  const navigate = useNavigate();

  const isAuth = () => {
    return lookInSession("access_token") ? true : false;
  };

  const signUp = async (fullname: string, email: string, password: string) => {
    await handleApiRequest<"">({
      fetch: () => callSignUp(fullname, email, password),
      show: () => show(),
      hide: () => hide(),
    });
  };

  const signIn = async (email: string, password: string) => {
    const data = await handleApiRequest<IAccount>({
      fetch: () => callSignIn(email, password),
      show: () => show(),
      hide: () => hide(),
    });

    if (data?.data) {
      const { access_token, user } = data.data;
      setUser(data.data.user);
      storeInSession("user", user);
      storeInSession("access_token", access_token);
    }
  };

  const signOut = () => {
    removeFromSession("user");
    removeFromSession("access_token");
    setUser(initStateUser);
  };

  const googleAuth = async () => {
    try {
      const res = await authWithGoogle();

      const accessToken = await res.user.getIdToken();

      if (accessToken) {
        const googleRes = await callSignInWithGoogle(accessToken);
        if (googleRes.data.data) {
          const { access_token, user } = googleRes.data.data;

          storeInSession("user", user);
          storeInSession("access_token", access_token);
          setUser(user);
          navigate("/");
          toast.success(googleRes.data.message || "Successfully!");
        }
      } else {
        toast.error("Access token invalid");
      }
    } catch (error) {
      toast.error("trouble login through google");
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuth, signUp, signIn, signOut, googleAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
