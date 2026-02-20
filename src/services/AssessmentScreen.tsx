export const getNextStep = async (
  history: { role: string; content: string }[],
) => {
  const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const model = "gemini-3-flash-preview";
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const prompt = `
    Tu es un coach spécialisé en thérapie par exposition pour l'anxiété sociale. 
    Ton but est de diagnostiquer le niveau de l'utilisateur en maximum 3 questions.
    
    RÈGLES :
    1. Si l'historique est vide, pose une question ouverte sur sa plus grande peur sociale.
    2. Si tu as assez d'infos, génère un défi.
    
    Réponds UNIQUEMENT en JSON :
    {
      "status": "question" | "challenge",
      "text": "ta question ou le titre du défi",
      "description": "détails du défi si status=challenge",
      "difficulty": 1-10
    }`;

  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: history.map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
      })),
      systemInstruction: { parts: [{ text: prompt }] },
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
};
