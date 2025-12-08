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

interface ReflectionProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (feeling: string, notes: string) => void;
  isLoading: boolean;
}

// Les options émotionnelles
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
  isLoading,
}: ReflectionProps) {
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!selectedFeeling) {
      Alert.alert(
        "Attention",
        "Veuillez sélectionner un sentiment pour continuer."
      );
      return;
    }
    if (notes.trim().length < 10) {
      Alert.alert(
        "Attention",
        "Veuillez écrire quelques lignes (minimum 10 caractères) sur votre expérience."
      );
      return;
    }
    onSave(selectedFeeling, notes.trim());

    // Réinitialiser le formulaire après la soumission (gérée par le parent après succès)
    // setSelectedFeeling('');
    // setNotes('');
  };

  const handleClose = () => {
    // Permettre la réinitialisation si l'utilisateur annule
    setSelectedFeeling("");
    setNotes("");
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/70">
        <View className="bg-slate-950 rounded-t-3xl p-6 h-4/5">
          {/* Header de la Modale */}
          <View className="flex-row justify-between items-center pb-4 border-b border-slate-800 mb-6">
            <Text className="text-2xl font-bold text-white">
              Ancrage Émotionnel
            </Text>
            <TouchableOpacity onPress={handleClose} className="p-2">
              <X color="#94A3B8" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-lg font-semibold text-white mb-2">
              1. Comment vous êtes-vous senti(e) après avoir terminé le défi ?
            </Text>

            {/* Sélection d'Émotion */}
            <View className="flex-row flex-wrap justify-between mb-8">
              {emotionOptions.map((option) => {
                const isSelected = selectedFeeling === option.key;
                return (
                  <TouchableOpacity
                    key={option.key}
                    className={`w-[48%] items-center p-3 rounded-xl border-2 my-1 ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/20"
                        : "border-slate-800 bg-slate-900"
                    }`}
                    onPress={() => setSelectedFeeling(option.key)}
                    disabled={isLoading}
                  >
                    <option.icon
                      color={isSelected ? "#818CF8" : "#94A3B8"}
                      size={24}
                    />
                    <Text
                      className={`mt-1 font-medium ${
                        isSelected ? "text-indigo-400" : "text-slate-400"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-lg font-semibold text-white mb-2">
              2. Quel est le plus grand apprentissage de cette expérience ?
            </Text>
            <TextInput
              className="w-full h-32 p-4 bg-slate-900 text-white rounded-xl border border-slate-800 mb-8"
              placeholder="Ex : J'ai réalisé que la peur était pire que l'action..."
              placeholderTextColor="#64748B"
              multiline
              value={notes}
              onChangeText={setNotes}
              editable={!isLoading}
            />
          </ScrollView>

          {/* Bouton de Sauvegarde */}
          <TouchableOpacity
            className={`w-full py-4 rounded-2xl flex-row items-center justify-center ${
              isLoading ? "bg-indigo-700/50" : "bg-indigo-600"
            } active:scale-95`}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 color="white" size={20} className="mr-2 animate-spin" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Confirmer et Ancrer le Progrès
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
