import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Get Gemini 2.5 Flash model instance
export function getGeminiModel() {
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

// Generate content using Gemini 2.5 Flash
export async function generateWithGemini(prompt: string) {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error with Gemini API:", error);
    throw error;
  }
}

// Convert OpenAI-style messages to Gemini format
export function convertMessagesToGeminiFormat(messages: Array<{ role: string; content: string }>) {
  return messages
    .filter(msg => msg.role !== 'system') // Gemini doesn't use system messages in the same way
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
}

// Generate content with conversation history
export async function generateWithGeminiChat(messages: Array<{ role: string; content: string }>) {
  try {
    const model = getGeminiModel();
    
    // Extract system message if present
    const systemMessage = messages.find(msg => msg.role === 'system');
    const conversationMessages = messages.filter(msg => msg.role !== 'system');
    
    // Convert to Gemini format
    const geminiMessages = convertMessagesToGeminiFormat(conversationMessages);
    
    // Start chat with history
    const chat = model.startChat({
      history: geminiMessages.slice(0, -1), // All but the last message
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
      },
    });
    
    // Get the last user message
    const lastMessage = conversationMessages[conversationMessages.length - 1];
    let prompt = lastMessage.content;
    
    // Prepend system instructions if available
    if (systemMessage) {
      prompt = `${systemMessage.content}\n\nUser: ${prompt}`;
    }
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error with Gemini Chat API:", error);
    throw error;
  }
}