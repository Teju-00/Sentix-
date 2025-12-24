
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { SentimentResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the sentiment of the following tweet or text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: { type: Type.STRING, description: "Positive, Negative, or Neutral" },
          score: { type: Type.NUMBER, description: "Sentiment score from 0 (very negative) to 100 (very positive)" },
          confidence: { type: Type.NUMBER, description: "Model confidence score from 0 to 100" },
          explanation: { type: Type.STRING, description: "Brief explanation of the sentiment analysis" },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key emotional words found" },
          emojis: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggested emojis for this sentiment" },
          intensity: { type: Type.STRING, description: "Intensity of the emotion: Low, Medium, High" }
        },
        required: ["sentiment", "score", "confidence", "explanation", "keywords", "emojis", "intensity"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as SentimentResult;
};

export const startAssistantChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "You are the Sentix Intelligence Assistant. You are an expert in social media trends, linguistic analysis, and sentiment patterns. You have access to Google Search grounding to provide real-time, up-to-date information and recent news. When users ask about trends or recent events, use your search tool. Help users interpret their results and provide deep insights. Keep responses premium, professional, and concise.",
    }
  });
};
