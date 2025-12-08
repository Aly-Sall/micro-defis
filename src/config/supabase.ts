// src/config/supabase.ts
/*import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

// ** REMPLACER CES VALEURS PAR VOTRE PROPRE CONFIGURATION SUPABASE **
const supabaseUrl = "https://xgmwulfltzlihijtselc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnbXd1bGZsdHpsaWhpanRzZWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODI2NjEsImV4cCI6MjA3OTc1ODY2MX0.7Io0Bj-MrALwwap8SlM4eaxywO4CbcUihcjFFdOCSts";

// --- GESTION DE LA PERSISTANCE (STOCKAGE SÉCURISÉ) ---
// Supabase a besoin d'un moyen de stocker le jeton de session de manière sécurisée (SecureStore est la méthode recommandée par Expo)
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});*/
