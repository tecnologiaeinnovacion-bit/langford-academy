
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTutorResponse = async (question: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Contexto del curso: ${context}\n\nPregunta del Estudiante: ${question}`,
      config: {
        systemInstruction: "Eres el Tutor IA oficial de Langford Academy. Debes responder SIEMPRE en español. Ayuda a los estudiantes a entender conceptos complejos de sus cursos de forma clara, motivadora y concisa. Usa Markdown para resaltar puntos clave.",
      },
    });
    return response.text || "Lo siento, no pude procesar tu pregunta en este momento.";
  } catch (error) {
    console.error("Error de Gemini:", error);
    return "El tutor IA no está disponible temporalmente. Por favor, intenta más tarde.";
  }
};
