import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Clé de sauvegarde
const THEME_KEY = "@UserTheme_Preference";

interface ThemeContextType {
  colorScheme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger la préférence au démarrage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme === "dark" || savedTheme === "light") {
          setColorScheme(savedTheme);
        } else {
          setColorScheme("dark"); // Par défaut sombre pour ton app
        }
      } catch (e) {
        console.error("Erreur chargement thème", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Fonction pour basculer
  const toggleTheme = async () => {
    const newTheme = colorScheme === "light" ? "dark" : "light";
    setColorScheme(newTheme);
    await AsyncStorage.setItem(THEME_KEY, newTheme);
  };

  if (!isLoaded) return null; // Ou un écran de chargement vide

  return (
    <ThemeContext.Provider
      value={{ colorScheme: colorScheme || "dark", toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personnalisé pour utiliser le thème facilement
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
