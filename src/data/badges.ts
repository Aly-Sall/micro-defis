import {
  Flame,
  Star,
  Zap,
  BookOpen,
  Shield,
  TrendingUp,
} from "lucide-react-native";

export interface Badge {
  id: string; // Clé unique pour le stockage
  name: string;
  description: string;
  icon: any; // Composant Lucide Icon
  color: string; // Couleur Tailwind CSS
  conditionType: "STREAK" | "LEVEL" | "REFLECTION" | "OTHER";
  conditionValue: number; // Valeur pour la condition (ex: streak de 3)
}

export const BADGES: Badge[] = [
  // --- Badges de Démarrage et Réflexion ---
  {
    id: "FIRST_SUCCESS",
    name: "Premier Pas",
    description: "Terminer son tout premier Micro-Défi.",
    icon: Star,
    color: "text-yellow-500",
    conditionType: "OTHER",
    conditionValue: 1, // Sera vérifié après le premier succès
  },
  {
    id: "FIRST_REFLECTION",
    name: "Journaliste de l’Âme",
    description: "Enregistrer sa première réflexion (ancrage émotionnel).",
    icon: BookOpen,
    color: "text-indigo-400",
    conditionType: "REFLECTION",
    conditionValue: 1,
  },

  // --- Badges de Série (Streak) ---
  {
    id: "STREAK_3",
    name: "Feu Follet",
    description: "Maintenir une série de 3 jours consécutifs.",
    icon: Flame,
    color: "text-red-500",
    conditionType: "STREAK",
    conditionValue: 3,
  },
  {
    id: "STREAK_7",
    name: "Rythme Maîtrisé",
    description: "Maintenir une série de 7 jours consécutifs.",
    icon: Flame,
    color: "text-red-600",
    conditionType: "STREAK",
    conditionValue: 7,
  },

  // --- Badges de Niveau ---
  {
    id: "LEVEL_2_REACHED",
    name: "Déblocage I",
    description: "Atteindre le niveau 2 de Confiance Sociale.",
    icon: Shield,
    color: "text-green-500",
    conditionType: "LEVEL",
    conditionValue: 2,
  },
  {
    id: "LEVEL_3_REACHED",
    name: "Accélérateur",
    description: "Atteindre le niveau 3 de Confiance Sociale.",
    icon: Zap,
    color: "text-yellow-500",
    conditionType: "LEVEL",
    conditionValue: 3,
  },
  {
    id: "LEVEL_MAX_REACHED",
    name: "Maître du Game",
    description: "Atteindre le plus haut niveau disponible.",
    icon: TrendingUp,
    color: "text-purple-500",
    conditionType: "LEVEL",
    conditionValue: 4,
  },
];

// Clé de stockage pour AsyncStorage
export const ACHIEVED_BADGES_KEY = "@AchievedBadges";
