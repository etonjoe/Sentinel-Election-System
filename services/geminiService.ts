import { GoogleGenAI, Type } from "@google/genai";
import { PollingUnitResult, AnomalyReport } from "../types";

const apiKey = process.env.API_KEY || '';
// Note: In a real app, you'd handle the missing key gracefully or prompt for it.
// For this demo, we assume it's there or fail safely.

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.error("Failed to initialize Gemini:", error);
}

export const analyzeAnomalies = async (data: PollingUnitResult[]): Promise<AnomalyReport[]> => {
  if (!ai) return [];

  // Filter down data to save tokens, send only relevant fields
  const simplifiedData = data.map(d => ({
    id: d.id,
    name: d.unitName,
    registered: d.registeredVoters,
    accredited: d.accreditedVoters,
    votes: d.votes
  }));

  const prompt = `
    Analyze the following election polling unit data for irregularities.
    Look for:
    1. Accredited voters exceeding registered voters.
    2. Total votes exceeding accredited voters.
    3. Suspiciously high turnout (>95%).
    4. One party getting >98% of votes in a competitive region.
    
    Return a JSON array of anomalies.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: JSON.stringify(simplifiedData) + prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              unitId: { type: Type.STRING },
              unitName: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ["high", "medium", "low"] },
              description: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: ["unitId", "unitName", "severity", "description", "recommendation"]
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as AnomalyReport[];
    }
    return [];
  } catch (error) {
    console.error("Gemini Anomaly Analysis Failed:", error);
    return [];
  }
};

export const generateExecutiveSummary = async (stats: any, recentIncidents: any[]): Promise<string> => {
    if (!ai) return "AI Service Unavailable. Please check API Key.";
  
    const prompt = `
      Generate a professional, executive-level election monitoring report (Markdown format).
      
      Current Statistics:
      ${JSON.stringify(stats)}
      
      Recent Incidents/Anomalies:
      ${JSON.stringify(recentIncidents)}
      
      The report should have:
      1. Title & Timestamp
      2. Participation Overview
      3. Key Risks & Incidents Summary
      4. Strategic Recommendations for the Admin Team.
      
      Keep it concise and formal.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      return response.text || "No report generated.";
    } catch (error) {
      console.error("Report generation failed:", error);
      return "Error generating report.";
    }
  };

export const askChatbot = async (history: {role: string, text: string}[], message: string): Promise<string> => {
  if (!ai) return "I'm offline right now.";

  try {
    const model = ai.models;
    // For simplicity in this simulation, we'll use a single turn generation with context or a fresh chat
    // But let's try a simple generateContent with system instruction
    const response = await model.generateContent({
        model: "gemini-2.5-flash",
        contents: `System: You are an expert election monitoring assistant. Help the admin with questions about electoral laws, logistics, and data interpretation.
        
        User: ${message}`,
    });
    return response.text || "I couldn't process that.";
  } catch (e) {
      return "Error contacting AI assistant.";
  }
}