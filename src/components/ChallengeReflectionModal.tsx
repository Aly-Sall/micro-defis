import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { X, Smile, Frown, Meh, Loader2 } from "lucide-react-native";
import { analyzeSentiment } from "../services/aiService"; // Import du nouveau service

interface ReflectionProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (
    feeling: string,
    notes: string,
    aiData: { score: number; label: string },
  ) => void;
  isLoading: boolean;
}

const emotionOptions = [
  {
    key: "Confident",
    icon: Smile,
    color: "text-green-400",
    label: "Confiant(e)",
  },
  { key: "Excited", icon: Smile, color: "text-indigo-400", label: "Excité(e)" },
  {
    key: "Anxious",
    icon: Frown,
    color: "text-yellow-400",
    label: "Anxieux(se)",
  },
  { key: "Relief", icon: Meh, color: "text-slate-400", label: "Soulagé(e)" },
];

export default function ChallengeReflectionModal({
  isVisible,
  onClose,
  onSave,
  isLoading: parentLoading,
}: ReflectionProps) {
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [notes, setNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSave = async () => {
    if (!selectedFeeling) {
      Alert.alert("Attention", "Veuillez sélectionner un sentiment.");
      return;
    }
    if (notes.trim().length < 10) {
      Alert.alert("Attention", "Veuillez écrire au moins 10 caractères.");
      return;
    }

    setIsAnalyzing(true);
    const aiData = await analyzeSentiment(notes.trim());
    setIsAnalyzing(false);

    onSave(selectedFeeling, notes.trim(), aiData);
    setSelectedFeeling("");
    setNotes("");
  };

  const isGlobalLoading = parentLoading || isAnalyzing;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/70">
        <View className="bg-slate-950 rounded-t-3xl p-6 h-4/5">
          <View className="flex-row justify-between items-center pb-4 border-b border-slate-800 mb-6">
            <Text className="text-2xl font-bold text-white">
              Ancrage Émotionnel
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X color="#94A3B8" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-lg font-semibold text-white mb-4">
              1. Comment vous sentez-vous ?
            </Text>
            <View className="flex-row flex-wrap justify-between mb-8">
              {emotionOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  className={`w-[48%] items-center p-3 rounded-xl border-2 my-1 ${selectedFeeling === option.key ? "border-indigo-500 bg-indigo-500/20" : "border-slate-800 bg-slate-900"}`}
                  onPress={() => setSelectedFeeling(option.key)}
                  disabled={isGlobalLoading}
                >
                  <option.icon
                    color={
                      selectedFeeling === option.key ? "#818CF8" : "#94A3B8"
                    }
                    size={24}
                  />
                  <Text
                    className={`mt-1 font-medium ${selectedFeeling === option.key ? "text-indigo-400" : "text-slate-400"}`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-lg font-semibold text-white mb-2">
              2. Qu'avez-vous appris ?
            </Text>
            <TextInput
              className="w-full h-32 p-4 bg-slate-900 text-white rounded-xl border border-slate-800 mb-8"
              placeholderTextColor="#64748B"
              multiline
              value={notes}
              onChangeText={setNotes}
              editable={!isGlobalLoading}
            />
          </ScrollView>

          <TouchableOpacity
            className={`w-full py-4 rounded-2xl flex-row items-center justify-center ${isGlobalLoading ? "bg-indigo-700/50" : "bg-indigo-600"}`}
            onPress={handleSave}
            disabled={isGlobalLoading}
          >
            {isGlobalLoading ? (
              <Loader2 color="white" size={20} className="animate-spin" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Confirmer l'analyse
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
