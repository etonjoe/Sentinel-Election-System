import { PollingUnitResult, AnomalyReport } from "../types";

// 🔴 CONFIGURATION: Update this URL to match your deployed Render server
const API_URL = "https://sentinel-election-system.onrender.com/api";

/**
 * 1. ANOMALY ANALYSIS
 * Sends simplified polling data to the backend for AI processing.
 */
export const analyzeAnomalies = async (data: PollingUnitResult[]): Promise<AnomalyReport[]> => {
  try {
    // Simplify data payload to reduce bandwidth and token usage
    const simplifiedData = data.map(d => ({
      id: d.id,
      name: d.unitName,
      registered: d.registeredVoters,
      accredited: d.accreditedVoters,
      votes: d.votes
    }));

    const response = await fetch(`${API_URL}/anomalies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: simplifiedData })
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }
    
    // The backend returns the parsed array directly
    const result = await response.json();
    return result; 

  } catch (error) {
    console.error("Anomaly Analysis Failed:", error);
    // Return empty array to prevent UI crash
    return [];
  }
};

/**
 * 2. EXECUTIVE SUMMARY
 * Sends stats and incidents to backend for Markdown report generation.
 */
export const generateExecutiveSummary = async (stats: any, recentIncidents: any[]): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats, incidents: recentIncidents })
    });

    if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
    }

    const result = await response.json();
    return result.text; // Text response from backend

  } catch (error) {
    console.error("Report generation failed:", error);
    return "Error generating report. Please check server connection.";
  }
};

/**
 * 3. CHAT ASSISTANT
 * Sends chat history and new message to backend.
 */
export const askChatbot = async (history: {role: string, text: string}[], message: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message })
    });

    if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
    }

    const result = await response.json();
    return result.text;

  } catch (e) {
    console.error("Chat error:", e);
    return "I'm having trouble reaching the election server right now.";
  }
}