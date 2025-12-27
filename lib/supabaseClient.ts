import { createClient } from '@supabase/supabase-js';

// Access environment variables
// In a real Vite/React setup, these might be import.meta.env.VITE_SUPABASE_URL
// For standard Create React App, it's process.env.REACT_APP_...
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
