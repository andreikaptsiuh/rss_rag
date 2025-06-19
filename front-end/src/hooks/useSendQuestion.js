import { useState } from "react";

export const useSendQuestion = () => {
    const [messages, setMessages] = useState([]);

    const updateMessage = (id, newText) => {
        const newMessages = messages.map((message) => {
            return message.id === id ? { ...message, text: newText } : message;
        });

        setMessages(newMessages);
    };

    const updateText = (updated) => {
        setMessages((prevMessages) => prevMessages.map((msg, index) => (msg.type === "bot" && index === prevMessages.length - 1 ? { ...msg, text: updated } : msg)));
    };

    const addUserMessage = (question) => {
        setMessages((prev) => [...prev, { id: prev.length, text: question, type: "user" }]);
    };

    const addBotMessage = () => {
        setMessages((prev) => [...prev, { id: prev.length, text: "", type: "bot" }]);
    };

    const sendQuestion = async (question) => {
        addUserMessage(question);
        addBotMessage();

        try {
            const res = await fetch("http://localhost:3000/ask", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: question }),
            });

            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let buffer = "";
            let text = "";

            while (true) {
                const { value, done } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                let lines = buffer.split("\n");
                buffer = lines.pop(); // Последняя строка может быть неполной

                for (const line of lines) {
                    const jsonStr = line.replace(/^data:\s*/, "");

                    if (jsonStr === "[DONE]" || jsonStr.includes('"done":true')) {
                        console.log("Stream done");
                        return;
                    }

                    try {
                        const parsed = JSON.parse(jsonStr);
                        const content = parsed.response || "";
                        text += content;

                        updateText(text);
                    } catch (err) {
                        console.error("JSON parse error:", err);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { sendQuestion, updateMessage, messages };
};
