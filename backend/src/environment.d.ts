import type { StringValue } from "ms";
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGODB_URL: string;
      SECRET_KEY: string;
      ACCESS_TOKEN_EXPIRESIN?: number | StringValue;
      REFRESH_TOKEN_EXPIRESIN?: number | StringValue;
      REFRESH_TOKEN_COOKIE_NAME: string;
      FIREBASE_ADMIN_CREDENTIAL: string;
    }
  }
}

export {};
