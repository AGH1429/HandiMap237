import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl= 'https://njxcpotblbejheayrgqrsupabase.com';
const supabaseKey= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qeGNwb3RibGJlamhlYXlyZ3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDUyNzUsImV4cCI6MjA5Njc4MTI3NX0.iMTlxep2Rdx_zJ1laq2rZnnR0LItj-O9VV6EUtz7C-Y';

export const supabase = createClient(supabaseUrl, supabaseKey,{
    auth:{
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl:false,
    }
});