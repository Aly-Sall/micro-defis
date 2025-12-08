import React from "react";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../lib/supabase"; // Ton fichier créé tout à l'heure

// Configure Google Signin une seule fois (peut être mis dans App.tsx aussi)
GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/userinfo.email"],
  webClientId:
    "16744214227-r3rk0uerfi6f3ol776cbimvan1ijoufp.apps.googleusercontent.com",

  iosClientId:
    "TON_CLIENT_ID_IOS_QUE_TU_VIENS_DE_CREER.apps.googleusercontent.com",
});

export default function AuthButton() {
  const handleGoogleLogin = async () => {
    try {
      // 1. Vérifier si les services Play sont dispos (Android)
      await GoogleSignin.hasPlayServices();

      // 2. Lancer la fenêtre Google native
      const userInfo = await GoogleSignin.signIn();

      // 3. Récupérer le token d'identité (idToken)
      if (userInfo.idToken) {
        // 4. Donner ce token à Supabase pour qu'il crée la session
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.idToken,
        });

        if (error) throw error;

        // Succès !
        Alert.alert("Succès", "Vous êtes connecté !");
        console.log("Utilisateur Supabase :", data.user);
      } else {
        throw new Error("Pas de token ID présent");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("L'utilisateur a annulé");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Déjà en cours");
      } else {
        console.error(error);
        Alert.alert("Erreur", error.message);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handleGoogleLogin}
      className="flex-row items-center justify-center bg-white py-4 px-6 rounded-xl border border-slate-200 shadow-sm mt-4"
    >
      {/* Tu peux mettre une icône Google ici */}
      <Text className="text-slate-700 font-bold text-base ml-2">
        Continuer avec Google
      </Text>
    </TouchableOpacity>
  );
}
