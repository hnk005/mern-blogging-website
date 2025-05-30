import {
  callMe,
  callRefreshToken,
  callSignIn,
  callSignInWithGoogle,
  callSignOut,
  callSignUp,
} from "@/config/axios";
import { authWithGoogle } from "@/services/firebase";
import {
  lookInSession,
  removeFromSession,
  storeInSession,
} from "@/services/session";
import { IAccount, IUserPersonalInfo } from "@/types/user.type";
import { handleApiRequest } from "@/utils/handleApi";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
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
    lookInSession("user") ?? initStateUser
  );

  const [accessToken, setAccessToken] = useState(
    lookInSession("access_token") ?? ""
  );

  const { show, hide } = globalLoading;
  const navigate = useNavigate();

  const isAuth = () => {
    return accessToken ? true : false;
  };

  const { data: token } = useQuery({
    queryKey: ["refreshToken"],
    queryFn: async () => {
      const res = await callRefreshToken();

      return res.data.data;
    },
    retry: false,
  });

  const {
    data: userInfo,
    refetch: refetchUser,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await callMe();
      return res.data.data;
    },
    retry: false,
    enabled: false,
  });

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
      setUser(user);
      setAccessToken(access_token);
      storeInSession("user", user);
      storeInSession("access_token", access_token);
    }
  };

  const signOut = async () => {
    await handleApiRequest<IAccount>({
      fetch: () => callSignOut(),
      show: () => show(),
      hide: () => hide(),
    });
    removeFromSession("user");
    removeFromSession("access_token");
    setUser(initStateUser);
    setAccessToken("");
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
          setAccessToken(access_token);
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

  useEffect(() => {
    if (token) {
      setAccessToken(token);
      storeInSession("access_token", token.access_token);
      refetchUser();
    }
  }, [token]);

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
      storeInSession("user", userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (isError) {
      removeFromSession("user");
      removeFromSession("access_token");
    }
  }, [isError]);

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(initStateUser);
      setAccessToken("");
    };

    window.addEventListener("force-logout", handleForceLogout);
    return () => window.removeEventListener("force-logout", handleForceLogout);
  }, []);

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
