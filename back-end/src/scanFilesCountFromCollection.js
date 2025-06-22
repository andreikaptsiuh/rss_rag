import path from "path";
import { readDirWrapper } from "./readDirWrapper.js";

const __dirname = import.meta.dirname;

export const scanFilesCountFromCollection = async () => {
    const baseDataPath = path.join(__dirname, "..", "..", "collection", "objects");
    const dirFolders = await readDirWrapper(baseDataPath);

    let res = 0;

    for await (const dir of dirFolders) {
        const currentDirPath = path.join(baseDataPath, dir);
        const files = await readDirWrapper(currentDirPath);

        res += files.length;
    }

    return res;
};
