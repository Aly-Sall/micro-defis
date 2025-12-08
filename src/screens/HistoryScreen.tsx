import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  CalendarCheck,
  BarChart3,
  Clock,
  Zap,
  Smile,
  Frown,
  Meh,
} from "lucide-react-native";
import { CHALLENGES } from "../data/challenges";
import { Calendar, LocaleConfig } from "react-native-calendars"; // <--- NOUVEL IMPORT

// Configuration de la locale en Français
LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

// Clés de stockage
const COMPLETED_CHALLENGES_KEY = "@CompletedChallenges";
const REFLECTIONS_KEY = "@ChallengeReflections";

// Interface pour les données combinées dans l'historique
interface HistoryEntry {
  date: string;
  challengeTitle: string;
  feeling: string;
  notes: string;
}

// Fonction utilitaire pour matcher l'icône et la couleur de l'émotion
const getEmotionDetails = (feelingKey: string) => {
  switch (feelingKey) {
    case "Confident":
      return { icon: Smile, color: "#10B981", label: "Confiant(e)" }; // Vert
    case "Excited":
      return { icon: Smile, color: "#818CF8", label: "Excité(e)" }; // Indigo
    case "Anxious":
      return { icon: Frown, color: "#FBBF24", label: "Anxieux(se)" }; // Jaune
    case "Relief":
      return { icon: Meh, color: "#94A3B8", label: "Soulagé(e)" }; // Gris
    default:
      return { icon: Zap, color: "#64748B", label: "Non Spécifié" };
  }
};

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState({}); // <--- NOUVEL ÉTAT

  const loadHistory = useCallback(async () => {
    try {
      const storedReflections = await AsyncStorage.getItem(REFLECTIONS_KEY);
      const reflections = storedReflections
        ? JSON.parse(storedReflections)
        : [];

      // 1. Logique pour le Journal de Réflexion
      const historyData: HistoryEntry[] = reflections
        .map((reflection: any) => {
          const challenge = CHALLENGES.find(
            (c) => c.id === reflection.challengeId
          );

          return {
            date: reflection.date,
            challengeTitle: challenge ? challenge.title : "Défi Inconnu",
            feeling: reflection.feeling,
            notes: reflection.notes,
          };
        })
        .sort(
          (
            a: { date: string | number | Date },
            b: { date: string | number | Date }
          ) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      setHistory(historyData);
      setTotalCompleted(historyData.length);

      // 2. Logique pour le Calendrier Visuel (Streak)
      const storedCompletedDates = await AsyncStorage.getItem(
        COMPLETED_CHALLENGES_KEY
      );
      const completedDates = storedCompletedDates
        ? JSON.parse(storedCompletedDates)
        : {};

      const marked: { [date: string]: any } = {};

      Object.keys(completedDates).forEach((date) => {
        if (completedDates[date]) {
          // Marquer les jours réussis en vert vif
          marked[date] = {
            selected: true,
            selectedColor: "#10B981",
            dotColor: "#10B981",
          };
        }
      });
      setMarkedDates(marked);
    } catch (e) {
      console.error("Erreur lors du chargement de l'historique :", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Fonction de formatage de la date (simple pour l'affichage)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 border-b border-slate-800">
        <Text className="text-3xl font-bold text-white">
          Journal de Progrès
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
      >
        {loading ? (
          <Text className="text-slate-400 text-center mt-10">
            Chargement de votre journal...
          </Text>
        ) : (
          <>
            {/* Section Calendrier Visuel */}
            <View className="flex-row items-center mb-4 mt-4">
              <CalendarCheck color="#94A3B8" size={18} className="mr-2" />
              <Text className="text-xl font-bold text-slate-300">
                Votre Série
              </Text>
            </View>

            <Calendar
              style={{ borderRadius: 12, marginBottom: 30 }}
              theme={{
                calendarBackground: "#1E293B", // slate-800
                dayTextColor: "#F8FAFC", // white
                textDisabledColor: "#334155", // slate-700
                monthTextColor: "#E0E7FF", // indigo-200
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "600",
                arrowColor: "#818CF8", // indigo-400
                todayTextColor: "#818CF8",
                selectedDayBackgroundColor: "#10B981", // green-600
                selectedDayTextColor: "#FFFFFF",
              }}
              markingType={"period"}
              markedDates={markedDates}
            />

            {/* Section Statistiques Résumé */}
            <View className="mb-8 p-4 bg-slate-900 rounded-xl border border-slate-800">
              <View className="flex-row items-center mb-2">
                <BarChart3 color="#94A3B8" size={18} className="mr-2" />
                <Text className="text-xl font-bold text-slate-300">
                  Statistiques Clés
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-2 border-b border-slate-800">
                <Text className="text-slate-400 text-base">
                  Entrées de journal (Total)
                </Text>
                <Text className="text-white font-bold text-lg">
                  {totalCompleted}
                </Text>
              </View>
            </View>

            {/* Liste de l'Historique / Journal */}
            <View className="flex-row items-center mb-4 mt-4">
              <Clock color="#94A3B8" size={18} className="mr-2" />
              <Text className="text-xl font-bold text-slate-300">
                Vos Réflexions Passées
              </Text>
            </View>

            {history.length > 0 ? (
              history.map((item, index) => {
                const emotion = getEmotionDetails(item.feeling);
                return (
                  <View
                    key={index}
                    className="p-4 mb-4 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    <View className="flex-row justify-between items-start border-b border-slate-800 pb-3 mb-3">
                      <View>
                        <Text className="text-xs text-indigo-400 font-semibold mb-1">
                          {formatDate(item.date)}
                        </Text>
                        <Text className="text-xl font-bold text-white">
                          {item.challengeTitle}
                        </Text>
                      </View>

                      {/* Puce Émotionnelle */}
                      <View className="flex-col items-center pt-1 w-20">
                        <emotion.icon color={emotion.color} size={20} />
                        <Text
                          style={{ color: emotion.color }}
                          className="text-xs mt-1 font-semibold text-center"
                        >
                          {emotion.label}
                        </Text>
                      </View>
                    </View>

                    {/* Notes de Réflexion */}
                    <Text className="text-slate-400 italic leading-relaxed">
                      "{item.notes}"
                    </Text>
                  </View>
                );
              })
            ) : (
              <View className="p-4 bg-slate-900 rounded-xl items-center">
                <Text className="text-slate-400 text-center">
                  Complétez votre premier défi pour commencer votre journal de
                  progrès !
                </Text>
              </View>
            )}
          </>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
