
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import chunKDoc from "../utils/chunker.js";
import { pineconeIndex } from "./pincoeServices.js";
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from '@pinecone-database/pinecone';
const ai = new GoogleGenAI({});
const History=[];
async function transformQuery(question){

History.push({
    role:'user',
    parts:[{text:question}]
    })  

const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: History,
    config: {
      systemInstruction: `You are a query rewriting expert. Based on the provided chat history, rephrase the "Follow Up user Question" into a complete, standalone question that can be understood without the chat history.
    Only output the rewritten question and nothing else.
      `,
    },
 });
 
 History.pop()
 return response.text
}


async function Chattting(userProblem, sessionId) {
    // console.log(userProblem)
    
    if(userProblem.length == 0) {
        throw console.error("length is 0");
        
    }
  const queries = await transformQuery(userProblem);
  

// console.log("chunking done")
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004",
  });

  const queryVector = await embeddings.embedQuery(queries);

  const searchResult = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
  
  });

  const context = searchResult.matches
    .map(match => match.metadata.text)
    .join("\n\n---\n\n");

     History.push({
    role:'user',
    parts:[{text:queries}]
   }) 

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History,
    config: {
      systemInstruction: `You will be given some context by user and you have to answer using the context only 
  Answer ONLY using the provided context.
If not found, say: "I could not find the answer in the provided document."

Context:
${context}
      `,
    },
  });

History.push({
    role:'model',
    parts:[{text:response.text}]
  })
    console.log("everything done");

  return {
    answer: response.text,
    sources: searchResult.matches.map(
      m => m.metadata.source || "uploaded document"
    ),
  };

}
export const askResponse = async (question, sessionId) => {
  return await Chattting(question, sessionId);
};
