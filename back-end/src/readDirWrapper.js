import { readdir } from "fs/promises";

export const readDirWrapper = async (path) => {
    try {
        return await readdir(path);
    } catch (e) {
        console.log("Read directory error:", e);
        return [];
    }
};
