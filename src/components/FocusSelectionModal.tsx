import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { FOCUS_AREAS } from '../data/focus_areas';

interface FocusSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (focusKey: string) => void;
  currentFocusKey: string;
}

export default function FocusSelectionModal({
  isVisible,
  onClose,
  onSelect,
  currentFocusKey,
}: FocusSelectionModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/70">
        <View className="bg-slate-950 rounded-t-3xl p-6 max-h-[80%]">
          {/* Header */}
          <View className="flex-row justify-between items-center pb-4 border-b border-slate-800 mb-6">
            <Text className="text-2xl font-bold text-white">
              Choisir mon Focus
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X color="#94A3B8" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-slate-400 mb-4">
              Sélectionnez le domaine sur lequel vous souhaitez vous concentrer aujourd'hui.
            </Text>

            {FOCUS_AREAS.map((focus) => {
              const isSelected = currentFocusKey === focus.key;
              return (
                <TouchableOpacity
                  key={focus.key}
                  className={`p-4 rounded-xl mb-3 border-2 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-slate-800 bg-slate-900'
                  }`}
                  onPress={() => onSelect(focus.key)}
                >
                  <View className="flex-row items-center mb-2">
                    <Text className="text-2xl mr-3">{focus.emoji}</Text>
                    <Text
                      className={`text-lg font-bold ${
                        isSelected ? 'text-indigo-400' : 'text-white'
                      }`}
                    >
                      {focus.title}
                    </Text>
                  </View>
                  <Text
                    className={`${
                      isSelected ? 'text-indigo-300' : 'text-slate-400'
                    }`}
                  >
                    {focus.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
