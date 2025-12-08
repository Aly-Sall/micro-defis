import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { Flame, Trophy, Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";

// Imports Personnels
import { Challenge, getSmartChallenge } from "../data/challenges";
import ChallengeCard from "../components/ChallengeCard";
import { useTheme } from "../context/ThemeContext"; // Pour gérer les couleurs des icônes

// Clés de stockage
const STORAGE_KEY = "@DailyChallenge_Data_v1";
const COMPLETED_CHALLENGES_KEY = "@CompletedChallenges";
const REFLECTIONS_KEY = "@ChallengeReflections";
const USER_ARCHETYPE_KEY = "@UserArchetype";
const USER_LEVEL_KEY = "@UserLevel";

const getGreeting = (archetype: string | null) => {
  const hour = new Date().getHours();
  const name = archetype ? archetype.split(" ")[1] : "Champion";
  if (hour < 12) return `Bonjour, ${name} ! ☀️`;
  if (hour < 18) return `Garde le rythme, ${name} ! 🚀`;
  return `Belle soirée, ${name} ! 🌙`;
};

export default function HomeScreen() {
  const { colorScheme } = useTheme(); // Récupère le mode (light/dark)
  const isFocused = useIsFocused();
  const confettiRef = useRef<any>(null);

  // États
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userArchetype, setUserArchetype] = useState<string | null>(null);

  // --- CHARGEMENT ---
  const loadDailyData = async () => {
    try {
      setIsLoading(true);

      // 1. Récupération Profil
      const storedArchetype = await AsyncStorage.getItem(USER_ARCHETYPE_KEY);
      setUserArchetype(storedArchetype);

      const storedLevel = await AsyncStorage.getItem(USER_LEVEL_KEY);
      const userLevel = storedLevel ? parseInt(storedLevel, 10) : 1;

      // 2. Récupération Données du jour
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const today = new Date().toDateString();

      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);

        // Est-ce que les données datent d'aujourd'hui ?
        if (data.date === today) {
          setCurrentChallenge(data.challenge);
          setIsCompleted(data.completed);
          setStreak(data.streak || 0);
        } else {
          // C'est une NOUVELLE JOURNÉE
          // On génère un défi adapté au niveau
          const newChallenge = getSmartChallenge(userLevel, []);

          // Calcul du streak : si hier était validé, on garde, sinon 0
          const newStreak =
            wasYesterday(data.date) && data.completed ? data.streak : 0;

          setCurrentChallenge(newChallenge);
          setIsCompleted(false);
          setStreak(newStreak);

          saveDailyData(newChallenge, false, newStreak, today);
        }
      } else {
        // PREMIER LANCEMENT DE L'HISTOIRE
        const newChallenge = getSmartChallenge(userLevel, []);
        setCurrentChallenge(newChallenge);
        setStreak(0);
        saveDailyData(newChallenge, false, 0, today);
      }
    } catch (e) {
      console.error("Erreur chargement", e);
    } finally {
      setIsLoading(false);
    }
  };

  const wasYesterday = (dateString: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString() === dateString;
  };

  const saveDailyData = async (
    challenge: Challenge,
    completed: boolean,
    streakCount: number,
    date: string
  ) => {
    const data = { challenge, completed, streak: streakCount, date };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  useEffect(() => {
    if (isFocused) {
      loadDailyData();
    }
  }, [isFocused]);

  // --- ACTIONS ---

  const handleCompleteChallenge = async () => {
    if (!currentChallenge) return;

    // Feedback Sensoriel
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (confettiRef.current) confettiRef.current.start();

    const newStreak = streak + 1;
    setStreak(newStreak);
    setIsCompleted(true);

    const todayDateObj = new Date();
    const todayString = todayDateObj.toDateString();
    const dateKey = todayDateObj.toISOString().split("T")[0]; // YYYY-MM-DD

    // Sauvegarde locale état jour
    await saveDailyData(currentChallenge, true, newStreak, todayString);

    try {
      // 1. Mise à jour Calendrier (Heatmap)
      const existingDatesJson = await AsyncStorage.getItem(
        COMPLETED_CHALLENGES_KEY
      );
      const existingDates = existingDatesJson
        ? JSON.parse(existingDatesJson)
        : {};
      existingDates[dateKey] = true;
      await AsyncStorage.setItem(
        COMPLETED_CHALLENGES_KEY,
        JSON.stringify(existingDates)
      );

      // 2. Mise à jour Journal (Historique)
      const existingReflectionsJson = await AsyncStorage.getItem(
        REFLECTIONS_KEY
      );
      const existingReflections = existingReflectionsJson
        ? JSON.parse(existingReflectionsJson)
        : [];

      const alreadyExists = existingReflections.some(
        (item: any) =>
          item.date === dateKey && item.challengeId === currentChallenge.id
      );

      if (!alreadyExists) {
        const newEntry = {
          date: dateKey,
          challengeId: currentChallenge.id,
          feeling: "Excited", // À améliorer plus tard avec une modale
          notes: `Défi ${currentChallenge.category || "Général"} validé ! +${
            currentChallenge.xp || 10
          } XP`,
        };
        const updatedReflections = [newEntry, ...existingReflections];
        await AsyncStorage.setItem(
          REFLECTIONS_KEY,
          JSON.stringify(updatedReflections)
        );
      }
    } catch (e) {
      console.error("Erreur historique", e);
    }
  };

  const handleSkipChallenge = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const storedLevel = await AsyncStorage.getItem(USER_LEVEL_KEY);
    const userLevel = storedLevel ? parseInt(storedLevel, 10) : 1;

    // On exclut le défi actuel pour ne pas retomber dessus
    const newChallenge = getSmartChallenge(userLevel, [
      currentChallenge?.id || "",
    ]);

    setCurrentChallenge(newChallenge);
    setIsCompleted(false);
    await saveDailyData(newChallenge, false, streak, new Date().toDateString());
  };

  if (isLoading || !currentChallenge) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    // FOND : Blanc cassé (Jour) / Bleu nuit (Nuit)
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <View
        className="pt-14 pb-6 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90"
        accessible={true}
        accessibilityLabel={`En-tête. ${getGreeting(userArchetype)}`}
      >
        <Text className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">
          {getGreeting(userArchetype)}
        </Text>
        <Text
          className="text-3xl font-extrabold text-slate-900 dark:text-white"
          accessibilityRole="header"
        >
          Micro-Défis
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Bar */}
        <View className="flex-row justify-between mb-8">
          {/* Streak */}
          <View
            className="flex-row items-center bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm"
            accessible={true}
            accessibilityLabel={`Série en cours : ${streak} jours`}
          >
            <Flame
              color={
                streak > 0
                  ? "#F59E0B"
                  : colorScheme === "dark"
                  ? "#64748B"
                  : "#94a3b8"
              }
              size={20}
            />
            <Text
              className={`ml-2 font-bold text-lg ${
                streak > 0
                  ? "text-amber-500"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {streak} Jours
            </Text>
          </View>

          {/* XP Total estimé */}
          <View
            className="flex-row items-center bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm"
            accessible={true}
            accessibilityLabel={`Expérience gagnée : ${streak * 25} points`}
          >
            <Trophy
              color={colorScheme === "dark" ? "#A5B4FC" : "#6366f1"}
              size={18}
            />
            <Text className="ml-2 font-bold text-slate-600 dark:text-slate-300">
              {streak * 25} XP
            </Text>
          </View>
        </View>

        {/* CARTE PRINCIPALE (Composant Accessible) */}
        <ChallengeCard
          challenge={currentChallenge}
          isCompleted={isCompleted}
          onSuccess={handleCompleteChallenge}
          onSkip={handleSkipChallenge}
          buttonContent={
            isCompleted ? (
              <View className="flex-row items-center">
                <Text className="text-green-700 font-bold text-lg mr-2">
                  Défi Validé !
                </Text>
                <Check size={24} color="#15803d" strokeWidth={3} />
              </View>
            ) : (
              <Text className="text-indigo-600 font-bold text-lg">
                J'ai relevé le défi !
              </Text>
            )
          }
        />

        <View className="h-24" />
      </ScrollView>

      {/* Confettis (Ignorés par l'accessibilité) */}
      <View
        accessible={false}
        pointerEvents="none"
        className="absolute top-0 left-0 right-0 bottom-0"
      >
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          ref={confettiRef}
          fadeOut={true}
          fallSpeed={3000}
        />
      </View>
    </View>
  );
}
