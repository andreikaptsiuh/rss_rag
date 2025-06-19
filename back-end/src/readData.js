import { readdir, readFile } from "fs/promises";
import path from "path";

const __dirname = import.meta.dirname;

const readDirWrapper = async (path) => {
    try {
        return await readdir(path);
    } catch (e) {
        console.log("Read directory error:", e);
        return [];
    }
};

export const readData = async (readFileCallback) => {
    const baseDataPath = path.join(__dirname, "..", "..", "collection", "objects");
    const dirFolders = await readDirWrapper(baseDataPath);

    for await (const dir of dirFolders) {
        const currentDirPath = path.join(baseDataPath, dir);
        const files = await readDirWrapper(currentDirPath);

        for await (const file of files) {
            const filePath = path.join(currentDirPath, file);

            console.log(file);

            const fileData = await readFile(filePath, "utf-8");
            await readFileCallback(fileData);
        }
    }
};
