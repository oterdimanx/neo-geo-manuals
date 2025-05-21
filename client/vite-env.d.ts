// <reference types="vite/client" />

interface ImportMetaEnv{
    VITE_API_BASE_URL: any
    VITE_API_URL: any
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}