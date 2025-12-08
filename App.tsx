import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "nativewind"; // Hook pour détecter le mode actif
import { ThemeProvider } from "./src/context/ThemeContext";

// Import des Types de navigation
import { RootStackParamList } from "./src/navigation/navigation";

// Import des Écrans
import LoginScreen from "./src/screens/LoginScreen"; // <--- 1. NOUVEL IMPORT
import OnboardingScreen from "./src/screens/OnboardingScreen";
import AssessmentScreen from "./src/screens/AssessmentScreen";
import TabNavigator from "./src/navigation/TabNavigator";

const RootStack = createNativeStackNavigator<RootStackParamList>();

// Composant Interne : Il est à l'intérieur du Provider, donc il peut utiliser useColorScheme
function AppNavigator() {
  const { colorScheme } = useColorScheme();

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Login" // <--- 2. ON DÉMARRE SUR LE LOGIN MAINTENANT
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          // Gestion du fond global pour éviter les flashs blancs entre les écrans
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#020617" : "#F8FAFC",
          },
        }}
      >
        {/* Écran 0 : Le Login (Porte d'entrée) */}
        <RootStack.Screen name="Login" component={LoginScreen} />

        {/* Écran 1 : L'intro */}
        <RootStack.Screen name="Onboarding" component={OnboardingScreen} />

        {/* Écran 2 : Le Quiz de profilage */}
        <RootStack.Screen name="Assessment" component={AssessmentScreen} />

        {/* Écran 3 : L'application principale (Tabs) */}
        <RootStack.Screen name="MainTabs" component={TabNavigator} />
      </RootStack.Navigator>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </NavigationContainer>
  );
}

// Composant Racine : Il injecte le contexte de thème
export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
