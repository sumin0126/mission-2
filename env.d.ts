/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Application
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: number

  // Instance Settings
  readonly VITE_DEFAULT_INSTANCE_REGION: string
  readonly VITE_MAX_INSTANCES_PER_USER: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
