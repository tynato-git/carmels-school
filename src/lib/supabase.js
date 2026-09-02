import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ypsijjhcmfbyepfczxqj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn(
    '⚠️ Supabase Anon Key is not set or using placeholder in .env. Please set VITE_SUPABASE_ANON_KEY in .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey || 'placeholder-key'
);

// Helper to check connection status
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('test_ping').select('*').limit(1);
    // If table doesn't exist, it still means we reached the Supabase API!
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      console.log('Supabase ping response:', error.message);
    }
    return { success: true };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: false, error: err };
  }
};
