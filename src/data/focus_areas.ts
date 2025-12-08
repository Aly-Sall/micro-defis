export interface FocusArea {
  key: string;
  title: string;
  description: string;
  emoji: string;
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    key: 'conversation',
    title: 'Conversation',
    description: 'Défis axés sur les interactions verbales et le dialogue',
    emoji: '💬',
  },
  {
    key: 'social',
    title: 'Social',
    description: 'Défis axés sur les interactions sociales et les rencontres',
    emoji: '👥',
  },
  {
    key: 'expression',
    title: 'Expression',
    description: 'Défis axés sur l\'expression de soi et la prise de parole',
    emoji: '🎤',
  },
  {
    key: 'confiance',
    title: 'Confiance',
    description: 'Défis axés sur le développement de la confiance en soi',
    emoji: '💪',
  },
];

export const DEFAULT_FOCUS_KEY = 'conversation';
