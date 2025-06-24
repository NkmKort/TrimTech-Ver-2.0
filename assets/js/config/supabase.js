import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const supabaseUrl = "https://dcyaytjualtuwvantpek.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjeWF5dGp1YWx0dXd2YW50cGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDU2NjksImV4cCI6MjA1NTc4MTY2OX0.RDsVndAUGJfQN90Ezg_xxoHF-506ST66e7cSzuQ26jM";

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
