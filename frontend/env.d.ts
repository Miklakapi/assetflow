/// <reference types="vite/client" />

declare global {
    interface ImportMetaEnv {
        readonly VITE_APP_TITLE: string
        readonly VITE_API_URL_PREFIX: string
        readonly VITE_USE_MOCKS: string
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv
    }
}
