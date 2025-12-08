import React from "react";
import { View, Text } from "react-native";
import { Zap, Star } from "lucide-react-native";

interface MascotProps {
  level: number;
  message: string;
}

// Une mascotte simple (l'icône d'une étoile pour la confiance/le guide)
export default function Mascot({ level, message }: MascotProps) {
  return (
    <View className="flex-row items-end mb-6">
      {/* Mascotte Visuelle (L'Étoile) */}
      <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center shadow-lg shadow-yellow-500/40">
        <Star color="white" size={24} fill="white" />
      </View>

      {/* Bulle de Dialogue */}
      <View className="flex-1 bg-slate-800 p-3 ml-2 rounded-xl rounded-bl-none border border-slate-700 shadow-md">
        <Text className="text-slate-200 text-sm italic">{message}</Text>
      </View>
    </View>
  );
}
