/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_CONTRIBUTIONS_API_URL?: string;
  readonly VITE_CV_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
