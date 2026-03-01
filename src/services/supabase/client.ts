import { createClient } from '@supabase/supabase-js';

// 注意：在实际使用时，需要从环境变量读取
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

