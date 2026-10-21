import OpenAI from "openai";

// Initialize the OpenAI client with DeepSeek's base URL and your DeepSeek key
const openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
});

export default openai;