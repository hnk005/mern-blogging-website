import axiosClient from "@/config/axios";
import { lookInSession, storeInSesstion } from "@/services/session";
import { SignInRequest, SignUpRequest } from "@/types/auth.type";
import { AxiosError } from "axios";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { globalLoading } from "react-global-loading";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextInterface {
  user: any;
  signup: (data: SignUpRequest) => Promise<void>;
  signin: (data: SignInRequest) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextInterface);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(lookInSession("user"));
  const { show, hide } = globalLoading;
  const navigate = useNavigate();
  const signup = async (data: SignUpRequest) => {};

  const signin = async (data: SignInRequest) => {
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
      const err = error as AxiosError;
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      hide();
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
