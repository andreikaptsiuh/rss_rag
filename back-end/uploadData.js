import { ChromaClient } from "chromadb";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import ollama from "ollama";
import { readData } from "./src/readData.js";
import "dotenv/config";

const DB_NAME = process.env.DB_NAME || "my_db";
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "llama3.2";

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 100 });

const chroma = new ChromaClient({ path: "http://localhost:8000" });
await chroma.deleteCollection({ name: DB_NAME });
const collection = await chroma.getOrCreateCollection({ name: DB_NAME });

let counter = 0;

const embedFile = async (fileData) => {
    if (fileData === "") return;

    const data = JSON.parse(fileData);

    let text = "";

    for (let field in data) {
        if (typeof data[field] === "string") {
            text += data[field] + "\n";
        }
    }

    const docs = await splitter.createDocuments([text]);

    for await (let doc of docs) {
        const response = await ollama.embed({
            model: EMBEDDING_MODEL,
            input: doc.pageContent,
        });

        const record = {
            ids: [String(counter)],
            embeddings: [response.embeddings[0]],
            documents: [doc.pageContent],
        };

        await collection.add(record);
        counter++;
    }
};

await readData(embedFile);
