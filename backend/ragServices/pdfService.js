import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
// import * as pdf from "pdf-parse";

// const pdf = require('pdf-parse');
const extractTextFromPDF = async (path) => {
const pdfLoader = new PDFLoader(path);
const rawDocs = await pdfLoader.load();
return rawDocs;
};

export default extractTextFromPDF;

 