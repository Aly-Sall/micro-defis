import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { supabase } from "../lib/supabase";
import { CHALLENGES } from "../data/challenges";
import { Smile, Frown, Meh, Zap, BrainCircuit } from "lucide-react-native";

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistoryFromSupabase = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("challenge_logs")
        .select("*")
        .order("completed_at", { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (e) {
      console.error("Erreur historique:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistoryFromSupabase();
  }, [loadHistoryFromSupabase]);

  return (
    <View className="flex-1 bg-slate-950">
      <View className="pt-12 pb-4 px-6 border-b border-slate-800">
        <Text className="text-3xl font-bold text-white">
          Journal Intelligent
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {history.map((item, index) => {
          const challenge = CHALLENGES.find((c) => c.id === item.challenge_id);
          const score = item.sentiment_score || 0;

          return (
            <View
              key={index}
              className="p-4 mb-4 rounded-xl bg-slate-900 border border-slate-800"
            >
              <View className="flex-row justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-xs text-indigo-400">
                    {new Date(item.completed_at).toLocaleDateString()}
                  </Text>
                  <Text className="text-lg font-bold text-white">
                    {challenge?.title || "Défi"}
                  </Text>
                </View>
                {/* Badge IA */}
                <View className="items-center px-2 py-1 bg-indigo-500/10 rounded-lg">
                  <BrainCircuit
                    color={score > 0 ? "#10B981" : "#F87171"}
                    size={16}
                  />
                  <Text className="text-[10px] text-slate-400 mt-1">
                    Score: {score.toFixed(2)}
                  </Text>
                </View>
              </View>
              <Text className="text-slate-400 italic">"{item.reflection}"</Text>
              <View className="mt-3 pt-3 border-t border-slate-800">
                <Text className="text-xs text-slate-500">
                  Analyse IA : {item.sentiment_label || "Neutre"}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
