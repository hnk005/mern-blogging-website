declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGODB_URI: string;
      SECRET_ACCESS_KEY: string;
    }
  }
}

export {};
