import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Zap, Repeat2, Clock, Star, Tag } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Challenge } from "../data/challenges";

interface ChallengeCardProps {
  challenge: Challenge;
  isCompleted: boolean;
  onSuccess: () => void;
  onSkip: () => void;
  buttonContent: JSX.Element;
}

export default function ChallengeCard({
  challenge,
  isCompleted,
  onSuccess,
  onSkip,
  buttonContent,
}: ChallengeCardProps) {
  const safeCategory = challenge.category || "Général";
  const difficulty = challenge.difficulty || 1;

  // Couleurs dynamiques
  const getCategoryColor = (cat: string) => {
    const normalizedCat = cat ? cat.trim() : "Général";
    switch (normalizedCat) {
      case "Social":
        return "bg-blue-500/20 text-blue-100";
      case "Carrière":
      case "Productivité":
        return "bg-amber-500/20 text-amber-100";
      case "Bien-être":
        return "bg-emerald-500/20 text-emerald-100";
      case "Expression":
      case "Audace":
        return "bg-rose-500/20 text-rose-100";
      case "Digital":
        return "bg-purple-500/20 text-purple-100";
      default:
        return "bg-slate-500/20 text-slate-100";
    }
  };

  const colorClasses = getCategoryColor(safeCategory);
  const [bgClass, textClass] = colorClasses.split(" ");

  return (
    <View className="mb-10" accessible={false}>
      <LinearGradient
        colors={
          isCompleted
            ? ["#86efac", "#22c55e"]
            : ["#6366f1", "#4338ca", "#312e81"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 rounded-3xl shadow-xl shadow-indigo-500/30"
        style={{
          borderWidth: 4,
          borderColor: isCompleted ? "#bbf7d0" : "#818cf8",
        }}
      >
        {/* En-tête : Badge Catégorie + Difficulté */}
        <View
          className="flex-row items-center justify-between mb-6"
          // Accessibilité : On groupe pour dire "Catégorie Social, Difficulté 2 sur 3"
          accessible={true}
          accessibilityLabel={`Catégorie ${safeCategory}, Difficulté ${difficulty} sur 3`}
        >
          <View
            className={`px-3 py-1 rounded-full flex-row items-center ${bgClass}`}
          >
            <Tag size={12} color="white" className="mr-1 opacity-80" />
            <Text className={`text-xs font-bold ${textClass}`}>
              {safeCategory.toUpperCase()}
            </Text>
          </View>

          <View className="flex-row">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                size={14}
                color="white"
                fill={star <= difficulty ? "white" : "transparent"}
                className="ml-0.5 opacity-80"
              />
            ))}
          </View>
        </View>

        {/* Titre et Description - Lus comme un Header */}
        <Text
          className="text-3xl font-semibold text-white mb-3 shadow-sm"
          accessibilityRole="header"
        >
          {challenge.title}
        </Text>

        <Text className="text-indigo-100 mb-6 leading-6 font-medium text-base">
          {challenge.description}
        </Text>

        {/* Métadonnées - Groupées pour une lecture fluide */}
        <View
          className="flex-row justify-between mb-8 bg-black/10 p-4 rounded-xl"
          accessible={true}
          accessibilityLabel={`Durée estimée : ${
            challenge.duration || "5 min"
          }, Gain : ${challenge.xp || 10} points d'expérience`}
        >
          <View className="flex-row items-center">
            <Clock size={18} color="#C7D2FE" className="mr-2" />
            <Text className="text-indigo-100 font-semibold">
              {challenge.duration || "5 min"}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Zap size={18} color="#FCD34D" className="mr-2" />
            <Text className="text-amber-200 font-bold">
              +{challenge.xp || 10} XP
            </Text>
          </View>
        </View>

        {/* Bouton d'action principal */}
        <TouchableOpacity
          className="w-full py-4 rounded-2xl items-center shadow-md active:opacity-90 bg-white"
          onPress={onSuccess}
          disabled={isCompleted}
          // Accessibilité Bouton
          accessibilityRole="button"
          accessibilityLabel={
            isCompleted ? "Défi déjà validé" : "Valider le défi"
          }
          accessibilityHint={
            isCompleted
              ? ""
              : "Double-taper pour compléter ce défi et gagner des XP"
          }
          accessibilityState={{ disabled: isCompleted }}
        >
          <View>{buttonContent}</View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Bouton Skip */}
      {!isCompleted && (
        <TouchableOpacity
          onPress={onSkip}
          className="flex-row items-center justify-center mt-6 py-3 px-4 bg-slate-800/80 rounded-xl active:bg-slate-700 border border-slate-700"
          accessibilityRole="button"
          accessibilityLabel="Changer de défi"
          accessibilityHint="Propose un nouveau défi aléatoire"
        >
          <Repeat2 color="#94A3B8" size={18} className="mr-2" />
          <Text className="text-slate-300 font-semibold text-sm">
            Ce défi ne me tente pas
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
