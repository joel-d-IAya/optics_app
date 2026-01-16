
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Edit an image using Gemini 2.5 Flash Image
   */
  async editImage(base64Image: string, prompt: string): Promise<string | null> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1],
                mimeType: 'image/png',
              },
            },
            {
              text: `Edita esta imagen siguiendo exactamente esta instrucción: ${prompt}. Devuelve solo la imagen editada.`,
            },
          ],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Error editing image:", error);
      return null;
    }
  },

  /**
   * AI Chat with Search Grounding
   */
  async chatWithSearch(query: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      return {
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (error) {
      console.error("Error with search grounding:", error);
      return { text: "Lo siento, no pude realizar la búsqueda en este momento.", sources: [] };
    }
  },

  /**
   * AI Chat with Maps Grounding
   */
  async findNearby(query: string, lat?: number, lng?: number) {
    try {
      const toolConfig = lat && lng ? {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      } : undefined;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig
        },
      });

      return {
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    } catch (error) {
      console.error("Error with maps grounding:", error);
      return { text: "Lo siento, no pude acceder al mapa en este momento.", sources: [] };
    }
  }
};
