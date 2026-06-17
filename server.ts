import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini client lazily
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.use(express.json());

// API route for chat with Search Grounding
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    if (!ai) {
      return res.json({
        text: "The Gemini API key is not configured yet. Please configure GEMINI_API_KEY in the Environment Settings to enable the AI Print Assistant with live Search Grounding!",
        sources: []
      });
    }

    // Format messages for @google/genai
    // Note: ensure roles are strictly "user" or "model"
    const formattedContents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Call the model with search grounding enabled
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: "You are Banalia3D Sentry, a helpful, high-tech AI 3D printing and boutique manufacturing assistant for Banalia3D Studio across India. Keep answers concise, highly engaging, and modern. Use your googleSearch tool (Google Search Grounding) to retrieve real-time 3D printing trends, specific filament specs (PLA, PETG, ABS, Resin), or pricing/troubleshooting. Answer like a true engineering and maker expert, always remaining polite and professional.",
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "I was unable to retrieve a response.";
    
    // Extract search grounding metadata if available and de-duplicate sources
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sourcesMap = new Map<string, string>();
    
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach(chunk => {
        if (chunk.web?.uri) {
          sourcesMap.set(chunk.web.uri, chunk.web.title || chunk.web.uri);
        }
      });
    }

    const sources = Array.from(sourcesMap.entries()).map(([url, title]) => ({
      title,
      url
    }));

    res.json({ text, sources });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message || "An error occurred with the AI model." });
  }
});

// Vite middleware flow
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
