export const printProgress = (processedFiles, totalFiles) => {
    const barLength = 50;

    const ratio = processedFiles / totalFiles;
    const percent = (ratio * 100).toFixed(2);
    const filledLength = Math.round(barLength * ratio);

    const bar = "█".repeat(filledLength) + "-".repeat(barLength - filledLength);

    process.stdout.write(`\rProcessed files: ${processedFiles}/${totalFiles} [${bar}] (${percent}%)`);

    if (processedFiles === totalFiles) {
        console.log("\nFinish");
    }
};
