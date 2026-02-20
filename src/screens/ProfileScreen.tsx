import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import {
  User as UserIcon,
  AlertTriangle,
  RefreshCw,
  Trophy,
  Moon,
  Sun,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BADGES, ACHIEVED_BADGES_KEY } from "../data/badges";
import { useTheme } from "../context/ThemeContext"; // <--- IMPORT DU HOOK

// Clés de stockage
const COMPLETED_CHALLENGES_KEY = "@CompletedChallenges";
const USER_LEVEL_KEY = "@UserLevel";
const REFLECTIONS_KEY = "@ChallengeReflections";

export default function ProfileScreen() {
  const isFocused = useIsFocused();
  const { colorScheme, toggleTheme } = useTheme(); // Utilisation du thème
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>([]);

  // Chargement des données au focus de l'écran
  const loadData = async () => {
    try {
      const storedBadges = await AsyncStorage.getItem(ACHIEVED_BADGES_KEY);
      setUnlockedBadgeIds(storedBadges ? JSON.parse(storedBadges) : []);
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  // --- FONCTION DE RÉINITIALISATION ---
  const resetLocalData = async () => {
    const keys = [
      "@DailyChallenge_Data_v1",
      "@CompletedChallenges",
      "@ChallengeReflections",
      "@UserArchetype",
      "@UserLevel",
    ];
    try {
      await AsyncStorage.multiRemove(keys);
      console.log("Données locales réinitialisées");
    } catch (e) {
      console.error("Erreur reset:", e);
    }
  };

  return (
    // Fond : Gris très clair (Jour) / Bleu très foncé (Nuit)
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 border-b border-slate-200 dark:border-slate-800">
        <Text className="text-3xl font-bold text-slate-900 dark:text-white">
          Mon Profil
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
      >
        {/* Section Compte */}
        <View className="flex-row items-center mb-6 p-4 bg-white dark:bg-indigo-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-indigo-500/30">
          <View className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500 rounded-full items-center justify-center mr-4">
            <UserIcon
              color={colorScheme === "dark" ? "white" : "#4338ca"}
              size={24}
            />
          </View>
          <View>
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              Utilisateur
            </Text>
            <Text className="text-slate-500 dark:text-indigo-200 text-sm">
              Profil Local
            </Text>
          </View>
        </View>

        {/* --- NOUVEAU : TOGGLE MODE SOMBRE --- */}
        <View className="flex-row items-center justify-between mb-8 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <View className="flex-row items-center">
            {colorScheme === "dark" ? (
              <Moon color="#818cf8" size={24} className="mr-3" />
            ) : (
              <Sun color="#f59e0b" size={24} className="mr-3" />
            )}
            <Text className="text-lg font-semibold text-slate-900 dark:text-white">
              Mode Sombre
            </Text>
          </View>
          <Switch
            value={colorScheme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ false: "#e2e8f0", true: "#4f46e5" }}
            thumbColor={colorScheme === "dark" ? "#ffffff" : "#f4f3f4"}
          />
        </View>

        {/* Section Trophées */}
        <View className="flex-row items-center mb-4 mt-2">
          <Trophy
            color={colorScheme === "dark" ? "#FBBF24" : "#d97706"}
            size={18}
            className="mr-2"
          />
          <Text className="text-xl font-bold text-slate-800 dark:text-slate-300">
            Mes Trophées
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-start mb-8 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          {BADGES.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            const BadgeIcon = badge.icon;

            return (
              <View
                key={badge.id}
                className="w-[33%] items-center justify-center p-2 mb-3"
                style={{ opacity: isUnlocked ? 1 : 0.2 }}
              >
                <BadgeIcon
                  size={36}
                  className={
                    isUnlocked
                      ? badge.color
                      : "text-slate-400 dark:text-slate-700"
                  }
                />
                <Text
                  className="text-center text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1"
                  numberOfLines={1}
                >
                  {badge.name}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Placeholder Sauvegarde */}
        <TouchableOpacity
          className="flex-row items-center justify-center p-4 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4 border border-slate-300 dark:border-slate-700"
          onPress={() =>
            Alert.alert("Info", "Sauvegarde Cloud bientôt disponible.")
          }
        >
          <Text className="text-slate-600 dark:text-slate-400 font-bold text-base">
            Sauvegarde Cloud (À venir)
          </Text>
        </TouchableOpacity>

        {/* Section Reset */}
        <View className="flex-row items-center mb-4 mt-8">
          <AlertTriangle
            color={colorScheme === "dark" ? "#FBBF24" : "#b45309"}
            size={18}
            className="mr-2"
          />
          <Text className="text-xl font-bold text-slate-800 dark:text-slate-300">
            Zone de Danger
          </Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center p-4 bg-red-100 dark:bg-yellow-900/40 rounded-xl border border-red-200 dark:border-transparent"
          onPress={resetLocalData}
        >
          <RefreshCw
            color={colorScheme === "dark" ? "#FBBF24" : "#dc2626"}
            size={20}
            className="mr-3"
          />
          <Text className="text-red-700 dark:text-yellow-400 font-bold text-base">
            Réinitialiser Tous les Progrès
          </Text>
        </TouchableOpacity>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
