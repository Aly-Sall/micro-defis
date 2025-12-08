import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/navigation";
import { Sparkles, ArrowRight } from "lucide-react-native";

// On typage la navigation pour avoir l'autocomplétion
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="flex-1 bg-slate-950 items-center justify-between py-12 px-6">
      {/* Partie Haute : Décoration */}
      <View className="items-center mt-10">
        <View className="w-20 h-20 bg-indigo-600 rounded-3xl items-center justify-center mb-8 shadow-lg shadow-indigo-500/50">
          <Sparkles color="white" size={40} />
        </View>
        <Text className="text-4xl font-bold text-white text-center mb-2">
          Micro<Text className="text-indigo-500">Défis</Text>
        </Text>
        <Text className="text-slate-400 text-lg text-center leading-6 mt-4">
          Booste ta confiance sociale.{"\n"}
          Un petit pas chaque jour.
        </Text>
      </View>

      {/* Partie Basse : Bouton d'action */}
      <View className="w-full">
        <TouchableOpacity
          className="w-full bg-white py-4 rounded-2xl flex-row items-center justify-center active:scale-95"
          // Mise à jour de la destination :
          onPress={() => navigation.navigate("Assessment")}
        >
          <Text className="text-slate-900 font-bold text-lg mr-2">
            Commencer
          </Text>
          <ArrowRight color="#0F172A" size={20} />
        </TouchableOpacity>
        <Text className="text-slate-600 text-center text-xs mt-6">
          Version Alpha 0.1
        </Text>
      </View>
    </View>
  );
}
