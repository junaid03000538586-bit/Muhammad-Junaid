import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRecommendations = async (query: string, currency: string = 'USD'): Promise<Product[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a list of 6-8 distinct product recommendations based on this user request: "${query}". 
      Focus on variety and relevance. Provide estimated prices in ${currency}. Return valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the product" },
              description: { type: Type.STRING, description: "Short description of the product features" },
              estimatedPrice: { type: Type.NUMBER, description: `Estimated price in ${currency}` },
              category: { type: Type.STRING, description: "Product category" },
              reason: { type: Type.STRING, description: "Why this product fits the user's request" }
            },
            required: ["name", "description", "estimatedPrice", "category", "reason"]
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("Empty response from AI");
    }

    const rawProducts = JSON.parse(jsonStr);

    // Add IDs and ensure currency is set
    return rawProducts.map((p: any, index: number) => ({
      ...p,
      id: `prod-${Date.now()}-${index}`,
      currency: currency
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};