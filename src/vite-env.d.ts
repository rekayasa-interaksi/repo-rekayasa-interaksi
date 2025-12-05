/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly NODE_ENV: string;
  readonly VITE_BUCKET_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 