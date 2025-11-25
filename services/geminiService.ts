import { GoogleGenAI } from "@google/genai";
import { EmailOptions } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert email marketing developer and designer. 
Your goal is to generate high-quality, responsive HTML email templates.

Rules:
1. Return ONLY the raw HTML code. Do not wrap it in markdown code blocks (no \`\`\`html).
2. Use inline CSS for all styling to ensure compatibility across email clients (Gmail, Outlook, etc.).
3. Use a max-width of 600px for the main container.
4. Make it responsive (use percentage widths where appropriate).
5. Use placeholder images from 'https://picsum.photos/width/height' where images are needed.
6. Ensure sufficient color contrast and professional typography.
7. Do not include <head> or <body> tags, just the container <div> or <table> wrapper that can be embedded.
8. Interpret the user's tone and audience requests to adjust the visual style (colors, fonts, spacing).
`;

export const generateEmailTemplate = async (options: EmailOptions): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Create an email template with the following specifications:
    - Type: ${options.type}
    - Topic: ${options.topic}
    - Target Audience: ${options.audience}
    - Tone: ${options.tone}
    - Context/Details: ${options.additionalContext}
    
    Make the design visually appealing and consistent with the requested tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance between creativity and structure
      }
    });

    let text = response.text || "";
    
    // Cleanup if model accidentally adds markdown
    text = text.replace(/^```html\s*/, '').replace(/```$/, '');
    
    return text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate email template. Please try again.");
  }
};
