// src/lib/supabase.ts
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Remplace ces valeurs par celles trouvées dans ton dashboard Supabase
const supabaseUrl = "https://xgmwulfltzlihijtselc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnbXd1bGZsdHpsaWhpanRzZWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODI2NjEsImV4cCI6MjA3OTc1ODY2MX0.7Io0Bj-MrALwwap8SlM4eaxywO4CbcUihcjFFdOCSts";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // C'est ici que la magie opère : Supabase utilise le stockage de ton téléphone
    // pour se souvenir que l'utilisateur est connecté, même si on ferme l'app.
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
