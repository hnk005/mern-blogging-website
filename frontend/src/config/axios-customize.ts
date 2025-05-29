import axiosClient from "axios";

const instance = axiosClient.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
  timeout: 5000,
});

instance.interceptors.request.use(function (config) {
  if (
    typeof window !== "undefined" &&
    window &&
    window.localStorage &&
    window.sessionStorage.getItem("access_token")
  ) {
    config.headers.Authorization =
      "Bearer " + window.sessionStorage.getItem("access_token");
  }
  if (!config.headers.Accept && config.headers["Content-Type"]) {
    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "application/json; charset=utf-8";
  }
  return config;
});

export default instance;
