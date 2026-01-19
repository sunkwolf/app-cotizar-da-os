import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://uokzfjgiqifzvqvqvksx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVva3pmamdpcWlmenZxdnF2a3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NzkxODIsImV4cCI6MjA4NDM1NTE4Mn0.mtURLjnFGxF7N3LFAVl3PJuyt4qiPoYYvzaoKsPFQQM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 0,
    },
  },
});

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  short_name: string;
  is_approved: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};
