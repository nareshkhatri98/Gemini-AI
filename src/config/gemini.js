import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const maxRetries = 5; // Maximum number of retry attempts
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const result = await chatSession.sendMessage(prompt);
      console.log(result.response.text());
      return result.response.text(); // Exit the loop on success
    } catch (error) {
      if (error instanceof GoogleGenerativeAIFetchError && error.status === 429) {
        attempt++;
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.warn(`Rate limited. Retrying in ${waitTime / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        console.error("Error:", error);
        break; // Exit the loop on non-rate-limiting errors
      }
    }
  }

  console.error("Failed to get a response after retries.");
}

export default run;
