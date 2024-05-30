import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAnBDUlI2r_pPRPzCyp7GkGuZY9oUjltBg');

export async function generateResponse(prompt) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
