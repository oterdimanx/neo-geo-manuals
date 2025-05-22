import { SupportedStorage, createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: 'pkce', // ← Add this line
      persistSession: true,
      autoRefreshToken: true,
      storage: {
        getItem: (key: any) => document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`))?.[2],
        setItem: (key: any, value: any) => {
          document.cookie = `${key}=${value}; path=/; Secure; SameSite=Lax`
        },
        removeItem: (key: any) => {
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      } as unknown as SupportedStorage // Type assertion if needed
    }    
  }
);