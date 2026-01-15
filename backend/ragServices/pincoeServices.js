//   import * as dotenv from 'dotenv';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
 if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}
  
  const pinecone = new Pinecone({

  
    // apiKey: process.env.PINECONE_API_KEY,
    apiKey:process.env.PINECONE_API_KEY,
    // environment: process.env.PINECONE_ENVIRONMENT,

  });

  export const pineconeIndex = pinecone.Index(
    process.env.PINECONE_INDEX_NAME
  );

 