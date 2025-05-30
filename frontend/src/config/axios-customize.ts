import axios from "axios";
import { Mutex } from "async-mutex";
import { removeFromSession, storeInSession } from "@/services/session";
import { IBackendRes } from "@/types/backend.type";
import { callRefreshToken } from "./axios";
import { onUnauthorized } from "@/utils/onUnauthorized";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
  withCredentials: true,
  timeout: 5000,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";
const AUTH_WHITELIST = ["/auth/sign-in", "/auth/sign-up", "/auth/google-auth"];

const handleRefreshToken = async (): Promise<string | null> => {
  return await mutex.runExclusive(async () => {
    try {
      const res = await callRefreshToken();
      return res.data.data?.access_token ?? null;
    } catch (e) {
      return null;
    }
  });
};

instance.interceptors.request.use((config) => {
  const token = window?.sessionStorage?.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  config.headers["Content-Type"] = "application/json; charset=utf-8";
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalConfig = error.config;
    const status = error?.response?.status;
    const url = originalConfig?.url;

    if (status === 401 && url === "/auth/refresh-token") {
      onUnauthorized();
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      !AUTH_WHITELIST.includes(url) &&
      !originalConfig.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handleRefreshToken();
      if (access_token) {
        storeInSession("access_token", access_token);
        originalConfig.headers[NO_RETRY_HEADER] = "true";
        originalConfig.headers.Authorization = `Bearer ${access_token}`;
        return instance(originalConfig);
      } else {
        onUnauthorized();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
