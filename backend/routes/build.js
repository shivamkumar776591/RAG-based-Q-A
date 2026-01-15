import * as dotenv from 'dotenv';
dotenv.config();
import  express from 'express';
const app = express();
// import pdf from "pdf-parse";
import multer from 'multer';
import path from 'path'
import crypto from 'crypto'

import cors from "cors";

app.use(cors({
  origin: "*",
}));

// import chunKDoc from '../utils/chunker.js';
import extractTextFromPDF from '../ragServices/pdfService.js';
import {getEmbedding} from '../ragServices/embeddService.js'
import { pineconeIndex } from '../ragServices/pincoeServices.js';
import chunKDoc from '../utils/chunker.js';
import { askResponse } from '../ragServices/askllm.js';



const sessionId = crypto.randomUUID();

import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";







// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
app.use(express.json());


// app.post("/upload",upload.single("file"),async (req,res)=>{
// try{
// // const loader = new PDFLoader(req.file.buffer);
//    const pdfLoader = new PDFLoader(req.file.buffer);
// const pdf = await pdfLoader.load();

// const textSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 1000,
//     chunkOverlap: 5,
//   });
// const chunkedDocs = await textSplitter.splitDocuments(pdf);


// const embeddings = new GoogleGenerativeAIEmbeddings({
//     apiKey: process.env.GEMINI_API_KEY,
     
    
//     model: 'text-embedding-004',
//   });

  
//   const pinecone = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY,
//     // environment: process.env.PINECONE_ENVIRONMENT,

//   });

//   const pineconeIndex = pinecone.Index(
//     process.env.PINECONE_INDEX_NAME
//   );

//   await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
//     pineconeIndex,
//     maxConcurrency: 5,
//   });

//   console.log("Database connected successfully ✅");


// }catch(e){
//     console.error("❌ Error indexing PDF:", e);
//     res.status(500).json({ error: "Failed to process PDF" });
// }
    


// })

app.post("/upload",upload.single("file"),async(req,res)=>{
  
  const filePath = req.file.path;
  const text = await extractTextFromPDF(filePath);
  console.log(text.length)

  const chunkData = await chunKDoc(text);
  console.log("chunking done");

  //empbedding

  // const embeddedData = await getEmbedding(chunKData.toString());

  
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
     
    
    model: 'text-embedding-004',
  });
  console.log("embedding done");

  //storing data on database
  
 await PineconeStore.fromDocuments(chunkData, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });



  console.log("Data stored");
  return res.json("uploaded");

  
})


app.post("/ask", async (req, res) => {
  try {
    const { question, sessionId } = req.body;

    if (!question || !sessionId) {
      return res.status(400).json({ error: "Missing question or sessionId" });
    }

    const result = await askResponse(question, sessionId);
    console.log(result);

    res.json({
      answer: result.answer,
      sources: result.sources,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});