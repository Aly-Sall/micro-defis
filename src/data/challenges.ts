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

// On renomme la liste statique pour la distinguer du générateur
export const STATIC_CHALLENGES: Challenge[] = [
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

// Pour la compatibilité ascendante si d'autres fichiers importent CHALLENGES
export const CHALLENGES = STATIC_CHALLENGES;

// --- SYSTÈME DE GÉNÉRATION PROCÉDURALE (Le "Cerveau" Intuitif) ---

interface ChallengeTemplate {
  title: string;
  templates: string[]; // Phrases à trous (ex: "Dis bonjour à {target}")
  vars: Record<string, string[]>; // Variables pour remplir les trous
  category: string;
  level: number;
  baseXp: number;
  difficulty: number;
  duration: string;
}

// Modèles de génération par Focus (Catégorie)
const GENERATOR_TEMPLATES: Record<string, ChallengeTemplate[]> = {
  social: [
    {
      title: "L'Interaction Spontanée",
      templates: [
        "Demande {question} à {target} {context}.",
        "Fais un compliment sur {sujet} à {target}.",
        "Souhaite une bonne journée à {target} {context}.",
      ],
      vars: {
        question: [
          "l'heure",
          "ton chemin",
          "une recommandation",
          "l'avis sur ce produit",
        ],
        target: ["un passant", "un commerçant", "un collègue", "un voisin"],
        context: [
          "dans la rue",
          "à la boulangerie",
          "dans les transports",
          "au travail",
        ],
        sujet: ["sa tenue", "son sourire", "son efficacité", "sa bonne humeur"],
      },
      category: "Social",
      level: 1,
      baseXp: 20,
      difficulty: 1,
      duration: "2 min",
    },
  ],
  conversation: [
    {
      title: "Le Maître des Mots",
      templates: [
        "Pose une question ouverte sur {topic} à {target}.",
        "Relance une conversation avec {target} en parlant de {topic}.",
      ],
      vars: {
        topic: [
          "ses projets du week-end",
          "un film récent",
          "ses hobbies",
          "la météo (avec humour)",
        ],
        target: [
          "un collègue",
          "un ami",
          "un membre de ta famille",
          "une connaissance",
        ],
      },
      category: "Social",
      level: 2,
      baseXp: 25,
      difficulty: 2,
      duration: "5 min",
    },
  ],
  expression: [
    {
      title: "Opinion Assumée",
      templates: [
        "Donne ton avis sur {sujet} {context} sans t'excuser.",
        "Propose une idée concernant {sujet} à {target}.",
      ],
      vars: {
        sujet: [
          "le choix du déjeuner",
          "un projet en cours",
          "une actualité légère",
        ],
        context: [
          "en réunion",
          "lors d'un repas",
          "dans une discussion de groupe",
        ],
        target: ["ton groupe d'amis", "tes collègues", "ta famille"],
      },
      category: "Carrière",
      level: 2,
      baseXp: 30,
      difficulty: 2,
      duration: "3 min",
    },
  ],
  confiance: [
    {
      title: "Zone de Courage",
      templates: [
        "Fais {action} pendant {duration} {context}.",
        "Tiens le regard de {target} pendant {duration}.",
      ],
      vars: {
        action: [
          "une marche tête haute",
          "un sourire franc",
          "un exercice de respiration",
        ],
        duration: [
          "2 minutes",
          "le temps d'une chanson",
          "le trajet vers le travail",
        ],
        context: [
          "dans la rue",
          "dans les transports",
          "dans une salle d'attente",
        ],
        target: ["un inconnu", "un interlocuteur", "ton reflet"],
      },
      category: "Bien-être",
      level: 1,
      baseXp: 15,
      difficulty: 1,
      duration: "5 min",
    },
  ],
};

// Utilitaires pour le générateur
const pickRandom = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];
const fillTemplate = (template: string, vars: Record<string, string[]>) => {
  return template.replace(/{(\w+)}/g, (_, key) =>
    vars[key] ? pickRandom(vars[key]) : `{${key}}`,
  );
};

const generateChallenge = (
  level: number,
  focusKey: string = "social",
): Challenge => {
  // 1. Sélectionner un template aléatoire pour ce focus
  const templates =
    GENERATOR_TEMPLATES[focusKey] || GENERATOR_TEMPLATES["social"];
  const templateData = templates[Math.floor(Math.random() * templates.length)];

  // 2. Remplir les trous (Mad Libs style)
  const description = fillTemplate(
    pickRandom(templateData.templates),
    templateData.vars,
  );

  // 3. Construire l'objet Challenge
  return {
    id: Date.now() + Math.floor(Math.random() * 10000), // ID unique généré
    level: level,
    title: templateData.title,
    description: description,
    category: templateData.category,
    difficulty: templateData.difficulty,
    duration: templateData.duration,
    xp: templateData.baseXp,
    focusKey: focusKey,
  };
};

/**
 * MOTEUR DE DÉFIS INTELLIGENT
 * Sélectionne un défi basé sur le niveau de l'utilisateur
 * et exclut les défis déjà réalisés ou refusés récemment.
 */
export const getSmartChallenge = (
  userLevel: number,
  excludeIds: (number | string)[] = [], // IDs à éviter (déjà faits ou skip)
  targetFocus?: string, // Focus optionnel (ex: 'social', 'confiance')
): Challenge => {
  // 1. Filtrer les défis STATIQUES par niveau
  // Si userLevel est 1, on prend les niveaux 1.
  // Si userLevel est 2, on prend les niveaux 1 et 2 (pour varier).
  // Si userLevel est 3, on prend tout le monde.
  const eligibleStatic = STATIC_CHALLENGES.filter((c) => c.level <= userLevel);

  // 2. Exclure les IDs passés en paramètre
  // On convertit les IDs en string pour être sûr de la comparaison
  const excludeSet = new Set(excludeIds.map((id) => id.toString()));

  let availableStatic = eligibleStatic.filter(
    (c) => !excludeSet.has(c.id.toString()),
  );

  // 3. Filtrer par Focus si demandé
  if (targetFocus) {
    const focused = availableStatic.filter((c) => c.focusKey === targetFocus);
    // Si on trouve des défis pour ce focus, on les priorise
    if (focused.length > 0) {
      availableStatic = focused;
    }
  }

  // 4. DÉCISION : Statique ou Généré ?
  // On introduit de l'aléatoire pour rendre ça "intuitif" et infini.
  // Si on a épuisé les statiques, on génère forcément.
  // Sinon, on a 40% de chance de générer un défi frais pour surprendre l'utilisateur.
  const shouldGenerate = availableStatic.length === 0 || Math.random() > 0.6;

  if (shouldGenerate) {
    // Si pas de focus cible, on en prend un au hasard parmi les templates disponibles
    const focus =
      targetFocus || pickRandom(Object.keys(GENERATOR_TEMPLATES) as string[]);
    return generateChallenge(userLevel, focus);
  }

  // 5. Sinon, on prend un défi statique (curated)
  const randomIndex = Math.floor(Math.random() * availableStatic.length);
  return availableStatic[randomIndex];
};
