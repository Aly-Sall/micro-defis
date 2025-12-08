import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { ArrowRight } from "lucide-react-native";
import AuthButton from "../components/AuthButton"; // Assure-toi que le chemin est bon

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const handleGuestAccess = () => {
    // Si l'utilisateur veut tester sans compte, on l'envoie vers l'Onboarding
    navigation.replace("Onboarding");
  };

  return (
    <View className="flex-1">
      {/* Fond Dégradé */}
      <LinearGradient
        colors={["#4f46e5", "#0f172a"]} // Indigo vers Noir bleuté
        className="flex-1 justify-center px-6"
      >
        {/* Logo / Titre */}
        <View className="items-center mb-16">
          <View className="w-24 h-24 bg-white/10 rounded-3xl items-center justify-center mb-6 border border-white/20">
            <Text className="text-6xl">🚀</Text>
          </View>
          <Text className="text-4xl font-extrabold text-white text-center mb-2">
            Micro-Défis
          </Text>
          <Text className="text-indigo-200 text-center text-lg font-medium">
            Devenez meilleur, 1% par jour.
          </Text>
        </View>

        {/* Bouton Google (Le composant qu'on a créé) */}
        <View className="mb-4">
          <AuthButton />
        </View>

        {/* Bouton Invité */}
        <TouchableOpacity
          onPress={handleGuestAccess}
          className="flex-row items-center justify-center py-4 rounded-xl border border-white/20 active:bg-white/10"
        >
          <Text className="text-indigo-100 font-semibold text-base mr-2">
            Continuer sans compte
          </Text>
          <ArrowRight size={18} color="#e0e7ff" />
        </TouchableOpacity>

        {/* Petit texte légal */}
        <Text className="text-white/30 text-center text-xs mt-8">
          En continuant, vous acceptez de devenir une machine de productivité.
        </Text>
      </LinearGradient>
    </View>
  );
}
