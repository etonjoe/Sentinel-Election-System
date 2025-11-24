const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. ANOMALY DETECTION ROUTE
app.post('/api/anomalies', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Define the JSON Schema for the AI response
    const schema = {
      description: "List of election anomalies",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          unitId: { type: SchemaType.STRING },
          unitName: { type: SchemaType.STRING },
          severity: { type: SchemaType.STRING, enum: ["high", "medium", "low"] },
          description: { type: SchemaType.STRING },
          recommendation: { type: SchemaType.STRING }
        },
        required: ["unitId", "unitName", "severity", "description", "recommendation"]
      }
    };

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", // Using the latest efficient model
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const prompt = `
      Analyze this polling unit data for election irregularities:
      ${JSON.stringify(data)}
      
      Look for:
      1. Accredited voters > registered voters.
      2. Votes > accredited.
      3. Turnout > 95%.
      4. One party > 98% votes.
    `;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("Anomaly Error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// 2. EXECUTIVE SUMMARY ROUTE
app.post('/api/summary', async (req, res) => {
  try {
    const { stats, incidents } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      Generate a professional election monitoring report (Markdown).
      Stats: ${JSON.stringify(stats)}
      Incidents: ${JSON.stringify(incidents)}
      
      Include: Title, Participation Overview, Key Risks, and Strategic Recommendations.
    `;

    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Summary generation failed" });
  }
});

// 3. CHATBOT ROUTE
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Convert history to format Gemini expects if needed, or use simple prompt
    const chat = model.startChat({
      history: history || [],
      systemInstruction: "You are an expert election monitoring assistant. Help the admin with electoral laws, logistics, and data interpretation."
    });

    const result = await chat.sendMessage(message);
    res.json({ text: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Chat failed" });
  }
});

const PORT = process.env.PORT || 3000;
// Add this to check if the server is running
app.get('/', (req, res) => {
  res.send('Sentinel Election System Backend is Active 🟢');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));