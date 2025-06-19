import { MarkdownContainer } from "./MarkdownContainer";

export const Message = ({ message }) => {
    const isThinkStart = message.text.includes("<think>");
    const isThinkEnded = message.text.includes("</think>");

    let thinkMessage = "";
    let generalMessage = "";

    if (isThinkStart && isThinkEnded) {
        const splitted = message.text.split("</think>");
        thinkMessage = splitted[0].split("<think>")[1];
        generalMessage = splitted[1];
    } else if (isThinkStart) {
        const splitted = message.text.split("<think>");
        thinkMessage = splitted[1];
    } else {
        generalMessage = message.text;
    }

    return (
        <>
            {thinkMessage && (
                <div className="p-2.5 bg-gray-950 border-gray-600 border-1 rounded-2xl max-w-[80%] text-left self-start text-sm">
                    <div className="flex justify-between items-center border-b-1 border-gray-600 pb-2 mb-2">
                        <span>Размышления...</span>

                        <span className="relative flex size-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                        </span>
                    </div>
                    
                    <MarkdownContainer>{thinkMessage}</MarkdownContainer>
                </div>
            )}

            {generalMessage && (
                <div className={`p-2.5 bg-gray-800 rounded-2xl max-w-[80%] text-left ${message.type === "user" ? "self-end" : "self-start"}`}>
                    <MarkdownContainer>{generalMessage}</MarkdownContainer>
                </div>
            )}
        </>
    );
};
