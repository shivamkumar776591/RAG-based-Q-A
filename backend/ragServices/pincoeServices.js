import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

export let pineconeIndex;

try {
  // 🔴 Check required env variables
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not defined");
  }

  if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error("PINECONE_INDEX_NAME is not defined");
  }

  // ✅ Initialize Pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  // ✅ Get index
  pineconeIndex = pinecone.Index(
    process.env.PINECONE_INDEX_NAME
  );

  console.log("✅ Pinecone initialized successfully");

} catch (error) {
  console.error("❌ Pinecone initialization failed:");
  console.error(error.message);

  // 🔥 Crash the app deliberately (best practice)
  process.exit(1);
}
