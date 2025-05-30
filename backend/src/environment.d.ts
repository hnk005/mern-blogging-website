import type { StringValue } from "ms";
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGODB_URL: string;
      REDIS_URL: string;
      SECRET_KEY: string;
      ACCESS_TOKEN_EXPIRESIN?: number | StringValue;
      REFRESH_TOKEN_EXPIRESIN?: number | StringValue;
      REFRESH_TOKEN_COOKIE_NAME: string;
    }
  }
}

export {};
