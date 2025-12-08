// src/navigation/navigation.ts
export type RootStackParamList = {
  Onboarding: undefined;
  Assessment: undefined;
  MainTabs: undefined;
  Login: undefined; // <--- AJOUTÉ
};

// Types pour le Bottom Tab Navigator (inchangés)
export type TabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};
