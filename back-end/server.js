import express from "express";
import cors from "cors";
import { ChromaClient } from "chromadb";
import axios from "axios";
import ollama from "ollama";
import "dotenv/config";

const DB_NAME = process.env.DB_NAME || "my_db";
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "llama3.2";
const MODEL = process.env.MODEL || "llama3.2";

const chroma = new ChromaClient({ path: "http://localhost:8000" });
const collection = await chroma.getOrCreateCollection({ name: DB_NAME });

const app = express();
const port = 3000;

// Позволяет распарсить JSON-тело запроса
app.use(express.json());
app.use(cors());

// Обработка POST-запроса
app.post("/ask", async (req, res) => {
    const userQuestion = req.body.question;

    if (!userQuestion) {
        return res.status(400).json({ e9rror: "No question provided" });
    }

    let query = req.body.question;
    let responseQuery = await ollama.embed({
        model: EMBEDDING_MODEL,
        input: query,
    });

    const result = await collection.query({
        queryEmbeddings: [responseQuery.embeddings[0]],
        nResults: 20,
    });

    // Собираем контекст
    const context = result.documents[0].join("\n");

    // Вызов LLaMA через Ollama
    const prompt = `Context:\n${context}\n\nQuery: ${query}\n\nResponse:`;

    const response = await axios.post(
        "http://localhost:11434/api/generate",
        {
            model: MODEL,
            prompt,
            stream: true,
        },
        {
            responseType: "stream",
        }
    );

    response.data.on("data", (chunk) => {
        res.write(chunk);
    });

    response.data.on("end", () => {
        res.end();
    });

    response.data.on("error", (err) => {
        console.error("Stream error", err);
        res.end();
    });
});

app.listen(port, () => {
    console.log(`Сервер слушает на http://localhost:${port}`);
});
