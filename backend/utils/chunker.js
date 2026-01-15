import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

const chunKDoc = async (doc)=>{
  
    const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 5,
  });
const chunkedDocs = await textSplitter.splitDocuments(doc);
return chunkedDocs
}
export default chunKDoc