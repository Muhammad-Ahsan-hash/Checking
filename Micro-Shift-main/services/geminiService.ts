import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DayLog, DayAnalysis } from "../types";

// Schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A friendly, non-judgmental summary of how the user spent their day (approx 2 sentences)."
    },
    insights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 3 simple, distinct observations about areas of over-investment or neglect based on the user's goals."
    },
    microChanges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING, description: "A very specific, small actionable change. Must be achievable in under 30 minutes." },
          impactLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          type: { type: Type.STRING, enum: ['Swap', 'Add', 'Reduce'], description: "The mechanism of the change: swapping a habit, adding a new one, or reducing time." }
        },
        required: ['title', 'description', 'impactLevel', 'type']
      },
      description: "Exactly 3 small, realistic micro-change recommendations."
    }
  },
  required: ['summary', 'insights', 'microChanges']
};

export const analyzeDay = async (log: DayLog): Promise<DayAnalysis> => {
  try {
    // Only initialize if we are about to make a call to ensure env var is picked up
    const ai = new GoogleGenAI({ apiKey: "AIzaSyD-vgVLMaPkIUcKlCneTZtf0P0ODEnjneQ" });

    const activitiesStr = log.activities
      .map(a => `- ${a.category}: ${a.durationMinutes} minutes ${a.description ? `(${a.description})` : ''}`)
      .join('\n');

    const goalsStr = log.goals.map(g => g.text).join(', ');

    const prompt = `
      Analyze the following daily activity log.
      
      User's stated goals: ${goalsStr || "None specified, focus on general balance."}
      
      Activities Logged:
      ${activitiesStr}
      
      Total time logged: ${log.totalMinutes} minutes.

      Task:
      1. Summary: Provide a gentle summary of the day.
      2. Insights: Identify exactly 3 distinct insights regarding their time allocation vs their goals. Be kind but observant.
         - Focus on patterns (e.g., "You spent 3h on social media but only 15m reading").
      3. Micro-Changes: Suggest exactly 3 "Micro-Changes". 
         - CRITICAL: These must be TINY, achievable adjustments.
         - NO major lifestyle overhauls.
         - Maximum duration for a suggested activity: 20-30 minutes.
         - Types:
           * Swap: Replace a bad habit with a good one (e.g. "Swap 15 mins of scrolling for reading").
           * Add: Insert a tiny new habit (e.g. "Drink water before coffee").
           * Reduce: Slightly cut down a time sink (e.g. "Stop work at 6pm sharp").
      
      Tone: Encouraging, reflective, non-judgmental.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        systemInstruction: "You are a helpful, empathetic habit coach who believes in small, incremental improvements.",
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DayAnalysis;
    }
    
    throw new Error("No response text generated");

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if API fails or key is missing
    return {
      summary: "We couldn't generate a deep analysis right now, but here is your breakdown.",
      insights: ["Check your connectivity or API key configuration."],
      microChanges: []
    };
  }
};