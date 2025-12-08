// data/challenges.ts

export interface Challenge {
  id: number;
  level: number; // 1: Débutant, 2: Intermédiaire, 3: Avancé
  title: string;
  description: string;
  category: string; // Ex: "Social", "Bien-être", "Carrière"
  difficulty: number; // 1 à 3 (pour les étoiles)
  duration: string; // Ex: "2 min", "10 min"
  xp: number; // Ex: 10, 20, 50
  focusKey: string; // Pour d'éventuelles icônes (ex: "social", "confiance")
}

export const DEFAULT_CHALLENGE: Challenge = {
  id: 0,
  level: 1,
  title: "Bienvenue : Planifier ta journée",
  description:
    "Réfléchis à 3 interactions sociales que tu VEUX avoir aujourd'hui, et note-les. C'est le premier pas pour sortir de la routine.",
  category: "Bien-être",
  difficulty: 1,
  duration: "5 min",
  xp: 10,
  focusKey: "introspection",
};

export const CHALLENGES: Challenge[] = [
  // --- NIVEAU 1 : DÉBUTANT ---
  {
    id: 101,
    level: 1,
    title: "Le Compliment Gratuit",
    description:
      "Fais un compliment sincère à un collègue, un voisin ou un commerçant. Reste simple et pars rapidement. Exemple : 'J'aime beaucoup votre veste !'",
    category: "Social",
    difficulty: 1,
    duration: "2 min",
    xp: 15,
    focusKey: "social",
  },
  {
    id: 102,
    level: 1,
    title: "Questionner un inconnu",
    description:
      "Demande l'heure ou une direction à quelqu'un dans la rue. L'objectif est juste d'engager le contact verbal.",
    category: "Social",
    difficulty: 1,
    duration: "1 min",
    xp: 20,
    focusKey: "conversation",
  },
  {
    id: 103,
    level: 1,
    title: "Le Post Furtif",
    description:
      "Poste une photo (même anonyme) sur une de tes histoires Instagram/Snapchat. Ne la supprime pas avant 2 heures.",
    category: "Digital",
    difficulty: 1,
    duration: "5 min",
    xp: 15,
    focusKey: "confiance",
  },

  // --- NIVEAU 2 : INTERMÉDIAIRE ---
  {
    id: 201,
    level: 2,
    title: "Brise-Glace en Réunion",
    description:
      "Si tu es en réunion (physique ou virtuelle), prends la parole au moins une fois pour poser une question, même si tu connais la réponse.",
    category: "Carrière",
    difficulty: 2,
    duration: "10 min",
    xp: 35,
    focusKey: "expression",
  },
  {
    id: 202,
    level: 2,
    title: "Le Grand 'Merci'",
    description:
      "Échange quelques mots avec un serveur, caissier ou chauffeur. Demande comment s'est passée leur journée en plus du simple 'merci'.",
    category: "Social",
    difficulty: 2,
    duration: "3 min",
    xp: 30,
    focusKey: "conversation",
  },

  // --- NIVEAU 3 : EXPERT ---
  {
    id: 301,
    level: 3,
    title: "Opinion Publique",
    description:
      "Participe à un débat en ligne (commentaire constructif sous un article) ou dans un petit groupe social en donnant ton avis sans t'excuser.",
    category: "Expression",
    difficulty: 3,
    duration: "15 min",
    xp: 60,
    focusKey: "expression",
  },
  {
    id: 302,
    level: 3,
    title: "Demande d'Aide",
    description:
      "Demande de l'aide concrète à quelqu'un que tu connais peu (ex: 'Pourriez-vous m'aider à porter ça ?' ou 'J'ai besoin de vos conseils sur X sujet').",
    category: "Social",
    difficulty: 3,
    duration: "5 min",
    xp: 75,
    focusKey: "vulnerabilite",
  },
];

/**
 * MOTEUR DE DÉFIS INTELLIGENT
 * Sélectionne un défi basé sur le niveau de l'utilisateur
 * et exclut les défis déjà réalisés ou refusés récemment.
 */
export const getSmartChallenge = (
  userLevel: number,
  excludeIds: (number | string)[] = [] // IDs à éviter (déjà faits ou skip)
): Challenge => {
  // 1. Filtrer par niveau
  // Si userLevel est 1, on prend les niveaux 1.
  // Si userLevel est 2, on prend les niveaux 1 et 2 (pour varier).
  // Si userLevel est 3, on prend tout le monde.
  const eligibleChallenges = CHALLENGES.filter((c) => c.level <= userLevel);

  // 2. Exclure les IDs passés en paramètre
  // On convertit les IDs en string pour être sûr de la comparaison
  const excludeSet = new Set(excludeIds.map((id) => id.toString()));

  const availableChallenges = eligibleChallenges.filter(
    (c) => !excludeSet.has(c.id.toString())
  );

  // 3. Sélectionner un défi aléatoire
  if (availableChallenges.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableChallenges.length);
    return availableChallenges[randomIndex];
  }

  // FALLBACK : Si tous les défis de ce niveau sont épuisés/exclus
  // On renvoie un défi du niveau de l'utilisateur, même s'il est dans la liste d'exclusion
  // (Pour éviter de planter ou de ne rien afficher)
  const fallbackPool = CHALLENGES.filter((c) => c.level === userLevel);
  if (fallbackPool.length > 0) {
    return fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
  }

  // ULTIME SECOURS
  return DEFAULT_CHALLENGE;
};
