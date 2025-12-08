import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient"; // Pour le fond stylé
import { ArrowRight, BrainCircuit, Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { RootStackParamList } from "../navigation/navigation";

// Typage de la navigation
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Assessment"
>;

// Clés de stockage
const USER_LEVEL_KEY = "@UserLevel";
const USER_ARCHETYPE_KEY = "@UserArchetype";

// --- LES QUESTIONS DU QUIZ ---
const QUESTIONS = [
  {
    id: 1,
    question: "Dans une soirée où tu ne connais personne, que fais-tu ?",
    options: [
      { label: "Je reste dans un coin sur mon téléphone 📱", score: 1 }, // Niveau 1
      { label: "J'attends qu'on vienne me parler 👋", score: 2 }, // Niveau 2
      { label: "Je vais me présenter à quelqu'un 🤝", score: 3 }, // Niveau 3
    ],
  },
  {
    id: 2,
    question: "Quel est ton plus grand obstacle actuel ?",
    options: [
      { label: "La peur du jugement des autres 👀", score: 1 },
      { label: "Ne pas savoir quoi dire (les blancs) 😶", score: 2 },
      { label: "Le manque d'opportunités de sortir 🏠", score: 3 },
    ],
  },
  {
    id: 3,
    question: "À quelle fréquence veux-tu des défis ?",
    options: [
      { label: "Doucement, 1 ou 2 fois par semaine 🐢", score: 1 },
      { label: "Un petit défi tous les jours 🗓️", score: 2 },
      { label: "Je veux progresser très vite ! 🚀", score: 3 },
    ],
  },
];

export default function AssessmentScreen() {
  const navigation = useNavigation<NavigationProp>();

  // États
  const [step, setStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isComputing, setIsComputing] = useState(false); // Pour l'effet "IA qui réfléchit"

  const currentQuestion = QUESTIONS[step];

  // Gestion de la réponse
  const handleAnswer = async (score: number) => {
    // 1. Feedback tactile
    await Haptics.selectionAsync();

    // 2. Mise à jour du score
    const newScore = totalScore + score;
    setTotalScore(newScore);

    // 3. Navigation
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      finishAssessment(newScore);
    }
  };

  // Calcul final et Sauvegarde
  const finishAssessment = async (finalScore: number) => {
    setIsComputing(true);

    // Petit délai artificiel pour faire croire que l'app réfléchit (Effet Wow)
    setTimeout(async () => {
      let level = 1;
      let archetype = "L'Observateur Zen 🧘";

      // Logique simple de calcul de niveau (Score max possible = 9)
      if (finalScore >= 8) {
        level = 3;
        archetype = "Le Challenger Audacieux 🦁";
      } else if (finalScore >= 5) {
        level = 2;
        archetype = "L'Explorateur Social 🧭";
      } else {
        level = 1;
        archetype = "L'Apprenti Serein 🌱";
      }

      try {
        // On sauvegarde tout
        await AsyncStorage.setItem(USER_LEVEL_KEY, String(level));
        await AsyncStorage.setItem(USER_ARCHETYPE_KEY, archetype);

        // Vibration de succès
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );

        // On lance l'app
        navigation.navigate("MainTabs");
      } catch (e) {
        console.error(e);
        navigation.navigate("MainTabs");
      }
    }, 1500); // 1.5 secondes de chargement
  };

  // Écran de chargement "Calcul du profil..."
  if (isComputing) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center px-6">
        <BrainCircuit
          size={64}
          color="#6366f1"
          className="mb-6 animate-pulse"
        />
        <Text className="text-2xl font-bold text-white text-center mb-2">
          Analyse de ton profil...
        </Text>
        <Text className="text-slate-400 text-center">
          Nous personnalisons tes premiers défis.
        </Text>
        <ActivityIndicator size="large" color="#6366f1" className="mt-8" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      {/* Fond Dégradé */}
      <LinearGradient
        colors={["#312e81", "#0f172a"]}
        className="flex-1 px-6 pt-12"
      >
        {/* Barre de progression */}
        <View className="flex-row items-center justify-between mb-8 mt-4">
          <View className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden mr-4">
            <View
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
            />
          </View>
          <Text className="text-slate-400 font-bold">
            {step + 1}/{QUESTIONS.length}
          </Text>
        </View>

        {/* Question */}
        <View className="mb-10">
          <Text className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-2">
            Question {step + 1}
          </Text>
          <Text className="text-3xl font-bold text-white leading-tight shadow-md">
            {currentQuestion.question}
          </Text>
        </View>

        {/* Options */}
        <View className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswer(option.score)}
              className="bg-white/10 border border-white/10 p-5 rounded-2xl flex-row items-center justify-between active:bg-indigo-600 active:border-indigo-400 transition-all"
            >
              <Text className="text-white text-lg font-semibold flex-1 mr-4">
                {option.label}
              </Text>
              <View className="bg-white/20 p-2 rounded-full">
                <ArrowRight color="white" size={16} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}
