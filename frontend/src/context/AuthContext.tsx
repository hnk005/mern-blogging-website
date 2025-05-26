import axiosClient from "@/config/axios";
import { authWithGoogle } from "@/services/firebase";
import {
  lookInSession,
  removeFromSession,
  storeInSesstion,
} from "@/services/session";
import { SignInRequest, SignUpRequest } from "@/types/auth.type";
import { PersionInfoResponse } from "@/types/user.type";
import { AxiosError } from "axios";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { globalLoading } from "react-global-loading";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextInterface {
  user: PersionInfoResponse;
  signUp: (data: SignUpRequest) => Promise<void>;
  signIn: (data: SignInRequest) => Promise<void>;
  googleAuth: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext({} as AuthContextInterface);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(
    lookInSession("user") || {
      access_token: "",
      profile_img: "",
      fullname: "",
      username: "",
    }
  );
  const { show, hide } = globalLoading;
  const navigate = useNavigate();

  const signUp = async (data: SignUpRequest) => {
    try {
      show();
      const res = await axiosClient.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/auth/sign-up",
        data
      );
      toast.success(res.data?.message);
      navigate("/sign-in");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      } else {
        console.error(error);
      }
    } finally {
      hide();
    }
  };

  const signIn = async (data: SignInRequest) => {
    try {
      show();
      const res = await axiosClient.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/auth/sign-in",
        data
      );
      storeInSesstion("user", res.data);
      setUser(res.data);
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
      } else {
        console.error(error);
      }
    } finally {
      hide();
    }
  };

  const signOut = () => {
    removeFromSession("user");
    setUser({
      access_token: "",
      profile_img: "",
      fullname: "",
      username: "",
    });
  };

  const googleAuth = async () => {
    try {
      const res = await authWithGoogle();

      const accessToken = await res.user.getIdToken();

      if (accessToken) {
        const googleRes = await axiosClient.post(
          import.meta.env.VITE_SERVER_DOMAIN + "/auth/google-auth",
          { access_token: accessToken }
        );

        storeInSesstion("user", googleRes.data);
        setUser(googleRes.data);
        navigate("/");
      } else {
        toast.error("Access token invalid");
      }
    } catch (error) {
      toast.error("trouble login through google");
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, googleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
