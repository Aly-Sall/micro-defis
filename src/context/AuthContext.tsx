/*import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Alert, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking"; // Pour récupérer le lien de redirection
import { supabase } from "../config/supabase"; // <--- NOUVEL IMPORT SUPABASE

// Nécessaire pour les navigateurs web (Expo Go)
WebBrowser.maybeCompleteAuthSession();

// --- INTERFACES ---
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Observer l'état de l'authentification Supabase
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Si la session existe, on crée notre objet utilisateur
          setUser({
            uid: session.user.id,
            email: session.user.email,
            displayName:
              session.user.user_metadata.full_name || session.user.email,
            photoURL: session.user.user_metadata.avatar_url,
          });
          Alert.alert(
            "Connexion Réussie",
            `Bienvenue ${session.user.user_metadata.full_name || ""} !`
          );
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Nettoyage de l'écouteur
    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  // 2. Fonction pour lancer la connexion Google (via Supabase OAuth)
  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Définir l'URI de redirection. Pour Expo Go, c'est l'URI de l'app Expo.
      const redirectTo = Linking.createURL("/");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo,
          // Le mode externe est nécessaire pour Expo Go
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        Alert.alert("Erreur de Connexion Google", error.message);
      }
      // Le reste est géré par l'écouteur onAuthStateChange
    } catch (e) {
      Alert.alert(
        "Erreur Inattendue",
        "Impossible de lancer le processus de connexion."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fonction de déconnexion Supabase
  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      Alert.alert("Déconnexion", "Vous êtes déconnecté.");
    } catch (error) {
      Alert.alert("Erreur de Déconnexion", "Impossible de vous déconnecter.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
*/
