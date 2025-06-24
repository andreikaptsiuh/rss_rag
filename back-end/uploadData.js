import "dotenv/config";
import { ChromaClient } from "chromadb";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import ollama from "ollama";
import { readData } from "./src/readData.js";
import { scanFilesCountFromCollection } from "./src/scanFilesCountFromCollection.js";
import { printProgress } from "./src/printProgress.js";

const DB_NAME = process.env.DB_NAME || "my_db";
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "llama3.2";
const CHUNKS_COUNT = 64;

const filesCount = await scanFilesCountFromCollection();

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 100 });

const chroma = new ChromaClient({ path: "http://localhost:8000" });
// await chroma.deleteCollection({ name: DB_NAME });
const collection = await chroma.getOrCreateCollection({ name: DB_NAME });

let chunksCounter = 0;
let filesCounter = 0;
let chunkBuffer = [];

printProgress(filesCounter, filesCount);

const embedChunks = async (chunks) => {
    const inputText = chunks.map((doc) => doc.pageContent);

    const response = await ollama.embed({
        model: EMBEDDING_MODEL,
        input: inputText,
    });

    const records = {
        ids: inputText.map((_, i) => String(chunksCounter + i)),
        embeddings: response.embeddings,
        documents: inputText,
    };

    await collection.add(records);
    chunksCounter += chunks.length;

    printProgress(filesCounter, filesCount);
};

const embedFile = async (fileData) => {
    filesCounter++;

    if (fileData === "") return;

    const docs = await splitter.createDocuments([fileData]);

    for await (let doc of docs) {
        chunkBuffer.push(doc);

        if (chunkBuffer.length >= CHUNKS_COUNT) {
            await embedChunks(chunkBuffer);
            chunkBuffer = [];
        }
    }

    if (filesCount === filesCounter && chunkBuffer.length > 0) {
        await embedChunks(chunkBuffer);
    }
};

await readData(embedFile, filesCount);
