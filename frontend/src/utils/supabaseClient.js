import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lmrzjjpyyscfkiucgphy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtcnpqanB5eXNjZmtpdWNncGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NDM0MjUsImV4cCI6MjA1ODMxOTQyNX0.F5KAdr1PI5MeXZjcnZ_taA5YrbNI2DXEl-UHNY1iCEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;