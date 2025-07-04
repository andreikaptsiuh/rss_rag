import { readFile } from "fs/promises";
import path from "path";
import { readDirWrapper } from "./readDirWrapper.js";

const __dirname = import.meta.dirname;

export const readData = async (readFileCallback) => {
    const baseDataPath = path.join(__dirname, "..", "..", "collection", "objects");
    const dirFolders = await readDirWrapper(baseDataPath);

    let counter = 0;

    for await (const dir of dirFolders) {
        const currentDirPath = path.join(baseDataPath, dir);
        const files = await readDirWrapper(currentDirPath);

        for await (const file of files) {
            const filePath = path.join(currentDirPath, file);

            const fileData = await readFile(filePath, "utf-8");
            await readFileCallback(fileData);
            counter++;
        }
    }
};
