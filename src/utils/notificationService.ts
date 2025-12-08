import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Clés de stockage
const NOTIFICATION_REMINDER_KEY = "@NotificationReminderTime";

// Liste des phrases motivantes (Intelligentes et émotionnelles)
const MOTIVATIONAL_PHRASES = [
  "1 minute aujourd’hui peut changer ta semaine.",
  "Tu es à un défi d’un badge important ! Vise la récompense 🏆.",
  "Le toi de demain te remerciera de ce petit pas fait aujourd'hui.",
  "Rappelle-toi pourquoi tu as commencé. Ton défi t'attend ! 🔥",
  "Fais quelque chose que ton futur toi te remerciera d'avoir fait. C'est l'heure du Micro-Défi.",
  "La confiance sociale s'entraîne. Aujourd'hui est ton jour de pratique. 💪",
  "Ce n'est pas grave si c'est petit. Ce qui compte, c'est que ce soit fait. Ton défi est prêt.",
];

// 1. Demander les permissions
export async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert(
      "Échec pour obtenir le jeton de notification. Assurez-vous que les permissions sont activées dans les réglages de votre téléphone."
    );
    return;
  }

  if (Notifications.getExpoPushTokenAsync) {
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  return token;
}

// 2. Annuler toutes les notifications existantes
export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// 3. Planifier la notification quotidienne intelligente
export async function scheduleDailyReminder(timeString: string) {
  // S'assurer que les permissions sont demandées
  await registerForPushNotificationsAsync();

  // Annuler les anciennes notifications pour éviter les doublons
  await cancelAllScheduledNotifications();

  // Parse l'heure (ex: "18:30" -> { hour: 18, minute: 30 })
  const [hours, minutes] = timeString.split(":").map(Number);

  // Choisir une phrase motivante aléatoire
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length);
  const bodyText = MOTIVATIONAL_PHRASES[randomIndex];

  // Planification de la notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "MicroDéfis : C'est le Moment ! 🔥",
      body: bodyText,
      sound: "default",
      data: { screen: "HomeTab" }, // Permet d'ouvrir l'app sur l'onglet Home
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: hours,
      minute: minutes,
      repeats: true, // Répéter tous les jours
    },
  });
}
function alert(arg0: string) {
  throw new Error("Function not implemented.");
}
