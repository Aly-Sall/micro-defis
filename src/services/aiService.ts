// src/services/aiService.ts

export const analyzeSentiment = async (text: string) => {
  try {
    // Remplace par ta véritable clé API Gemini
    const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyse le sentiment du texte suivant écrit par quelqu'un qui travaille sur son anxiété sociale. 
            Réponds UNIQUEMENT avec un JSON au format suivant : {"score": number, "label": string}. 
            Le score doit être compris entre -1 (très anxieux/négatif) et 1 (très confiant/positif). 
            Texte : "${text}"`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;

    // Nettoyage au cas où l'IA ajoute des balises markdown
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Erreur lors de l'analyse IA :", error);
    return { score: 0, label: "Neutre" };
  }
};
