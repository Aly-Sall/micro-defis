import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  Flame,
  Trophy,
  Check,
  Brain,
  Sparkles,
  ArrowRight,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";

// Imports internes
import ChallengeCard from "../components/ChallengeCard";
import { supabase } from "../lib/supabase";
import ChallengeReflectionModal from "../components/ChallengeReflectionModal";
import { analyzeSentiment } from "../services/aiService"; // Ton nouveau service de mentorat

const STORAGE_KEY = "@DailyChallenge_Data_v1";
const ASSESSMENT_KEY = "@UserAssessmentResult";

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const confettiRef = useRef<any>(null);

  // États
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [aiMentorFeedback, setAiMentorFeedback] = useState<any>(null);

  // --- LOGIQUE DE CHARGEMENT ---
  const loadDailyData = async () => {
    try {
      setIsLoading(true);

      // 1. Vérifier si l'évaluation IA a été faite
      const assessmentData = await AsyncStorage.getItem(ASSESSMENT_KEY);
      if (!assessmentData) {
        setHasAssessment(false);
        setIsLoading(false);
        return;
      }
      setHasAssessment(true);
      const parsedAssessment = JSON.parse(assessmentData);

      // 2. Charger le défi du jour (stocké ou généré)
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const today = new Date().toDateString();

      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        if (data.date === today) {
          setCurrentChallenge(data.challenge);
          setIsCompleted(data.completed);
          setStreak(data.streak || 0);
          setAiMentorFeedback(data.aiFeedback || null);
        } else {
          // Nouvelle journée : On utilise les données de l'évaluation pour le nouveau défi
          setupNewDay(parsedAssessment, data.streak, data.completed);
        }
      } else {
        // Premier défi après évaluation
        setupNewDay(parsedAssessment, 0, false);
      }
    } catch (e) {
      console.error("Erreur chargement HomeScreen:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const setupNewDay = async (
    assessment: any,
    oldStreak: number,
    wasCompleted: boolean,
  ) => {
    // Ici, le défi vient de l'évaluation initiale ou d'une rotation
    const newChallenge = assessment.challenge;
    const newStreak = wasCompleted ? oldStreak : 0;

    setCurrentChallenge(newChallenge);
    setIsCompleted(false);
    setStreak(newStreak);

    await saveDailyData(
      newChallenge,
      false,
      newStreak,
      new Date().toDateString(),
      null,
    );
  };

  const saveDailyData = async (
    challenge: any,
    completed: boolean,
    streakCount: number,
    date: string,
    aiFeedback: any,
  ) => {
    const data = {
      challenge,
      completed,
      streak: streakCount,
      date,
      aiFeedback,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  useEffect(() => {
    if (isFocused) loadDailyData();
  }, [isFocused]);

  // --- ACTIONS ---

  const handleCompleteChallenge = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (confettiRef.current) confettiRef.current.start();
    setIsModalVisible(true);
  };

  const onSaveReflection = async (
    feeling: string,
    notes: string,
    aiData: { score: number; label: string },
  ) => {
    try {
      setIsLoading(true);

      // On utilise les données déjà analysées par le modal via analyzeSentiment
      const aiResult = {
        feedback: "Analyse terminée",
        reframe: aiData.label,
        score: aiData.score,
      };
      setAiMentorFeedback(aiResult);

      // Sauvegarde Supabase (Bypass si non connecté comme discuté)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id || "00000000-0000-0000-0000-000000000000";

      await supabase.from("challenge_logs").insert({
        user_id: userId,
        challenge_id: currentChallenge.id,
        reflection: notes,
        emotion: feeling,
        sentiment_score: aiData.score,
        ai_feedback: aiData.label,
        ai_reframe: aiResult.reframe,
      });

      const newStreak = streak + 1;
      setStreak(newStreak);
      setIsCompleted(true);
      setIsModalVisible(false);

      await saveDailyData(
        currentChallenge,
        true,
        newStreak,
        new Date().toDateString(),
        aiResult,
      );
    } catch (e) {
      Alert.alert("Erreur", "L'IA n'a pas pu analyser ton texte.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDU ÉCRAN VIDE (Pas d'évaluation) ---
  if (!isLoading && !hasAssessment) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center px-8">
        <Brain color="#818CF8" size={60} />
        <Text className="text-white text-2xl font-bold mt-6 text-center">
          Prêt pour ton diagnostic ?
        </Text>
        <Text className="text-slate-400 text-center mt-2 mb-8">
          L'IA doit évaluer tes limites pour te proposer un défi adapté.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Assessment")}
          className="bg-indigo-600 px-8 py-4 rounded-2xl flex-row items-center"
        >
          <Text className="text-white font-bold mr-2">
            Commencer l'évaluation
          </Text>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) return <ActivityIndicator className="flex-1 bg-slate-950" />;

  return (
    <View className="flex-1 bg-slate-950">
      <ScrollView className="px-6 pt-12">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-white">Ton Défi IA</Text>
          <View className="bg-slate-900 px-4 py-2 rounded-full border border-slate-800 flex-row items-center">
            <Flame color={streak > 0 ? "#F59E0B" : "#475569"} size={20} />
            <Text className="text-white ml-2 font-bold">{streak}</Text>
          </View>
        </View>

        <ChallengeCard
          challenge={currentChallenge}
          isCompleted={isCompleted}
          onSuccess={handleCompleteChallenge}
          onSkip={() =>
            Alert.alert(
              "Patience",
              "Le mentor a choisi ce défi spécifiquement pour toi.",
            )
          }
          buttonContent={
            <Text className="text-indigo-600 font-bold text-lg">
              {isCompleted ? "Défi Terminé ✨" : "J'ai relevé le défi !"}
            </Text>
          }
        />

        {/* AFFICHAGE DU MENTOR IA APRÈS COMPLÉTION */}
        {isCompleted && aiMentorFeedback && (
          <View className="mt-8 p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl">
            <View className="flex-row items-center mb-3">
              <Sparkles color="#818CF8" size={20} />
              <Text className="text-indigo-400 font-bold ml-2 uppercase text-xs tracking-widest">
                Conseil du Mentor
              </Text>
            </View>
            <Text className="text-white text-lg font-medium mb-2">
              {aiMentorFeedback.feedback}
            </Text>
            <View className="h-[1px] bg-indigo-500/20 my-2" />
            <Text className="text-slate-400 italic text-sm">
              "{aiMentorFeedback.reframe}"
            </Text>
          </View>
        )}
      </ScrollView>

      <ChallengeReflectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={onSaveReflection}
        isLoading={isLoading}
      />

      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
      />
    </View>
  );
}
