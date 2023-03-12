declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    MONGO_URI: string;
    MONGO_URI_TEST: string;
    PORT: string;
  }
}
