import dotenv from "dotenv";
dotenv.config({path:'../.env'});

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

// ⚠️ For testing only (DO NOT commit real keys)
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
     
    
    model: 'text-embedding-004',
  });

export const getEmbedding = async (text) => {
  try {
    // Basic validation
    if (typeof text !== "string" || text.trim().length === 0) {
      throw new Error("getEmbedding expects a non-empty string");
    }
   const embedding = await embeddings.embedQuery(text);
return embedding;


    // const model = genAI.getGenerativeModel({
    //   model: "text-embedding-004",
    // });
// const result = await embeddings.model(text)
  } catch (error) {
    // 🔴 FULL ERROR LOGGING
    console.error("❌ Gemini Embedding Error");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Stack:", error.stack);

    // If Gemini returns nested details
    if (error.cause) {
      console.error("Cause:", error.cause);
    }

    throw error; // rethrow so caller knows it failed
  }
};
