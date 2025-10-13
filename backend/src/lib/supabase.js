import { createClient } from '@supabase/supabase-js'
import { env } from '../config/env.js'

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('[supabase] Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. Los endpoints que consultan BD fallarán.')
}

export const supabase = createClient(
  env.SUPABASE_URL ?? '',
  env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  {
    auth: { persistSession: false },
    global: { headers: { 'X-Client-Info': 'gymadmin-backend/1.0.0' } }
  }
)