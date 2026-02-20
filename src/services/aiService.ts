// src/services/aiService.ts

export const analyzeSentiment = async (text: string) => {
  try {
    const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    // Utilisation du modèle Gemini 3 Flash disponible dans ta liste
    const model = "gemini-3-flash-preview";
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    if (!API_KEY) {
      console.error("Clé API manquante dans le .env");
      return { score: 0, label: "Erreur Config" };
    }
    console.log(
      "DEBUG_KEY:",
      process.env.EXPO_PUBLIC_GEMINI_API_KEY?.substring(0, 10) + "...",
    );
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Tu es un coach. Analyse le sentiment du texte suivant. 
            Réponds UNIQUEMENT avec un JSON au format : {"score": number, "label": string}. 
            Le score est entre -1 et 1. Texte : "${text}"`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erreur API Google :", data.error.message);
      return { score: 0, label: "Erreur API" };
    }

    if (!data.candidates || data.candidates.length === 0) {
      return { score: 0, label: "Neutre" };
    }

    const rawResult = data.candidates[0].content.parts[0].text;
    return JSON.parse(rawResult);
  } catch (error) {
    console.error("Erreur technique IA :", error);
    return { score: 0, label: "Erreur" };
  }
};
