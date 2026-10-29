/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_CONTRIBUTIONS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
