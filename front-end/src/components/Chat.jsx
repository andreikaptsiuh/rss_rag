import { useContext, useRef, useEffect } from "react";
import { MessagesContext } from "../contexts/MessagesContext";
import { Message } from "./Message";

export const Chat = () => {
    const { messages } = useContext(MessagesContext);

    const chatRef = useRef(null);

    useEffect(() => {
        if (!chatRef.current) return;

        const heightscroll = chatRef.current.scrollHeight;
        chatRef.current.scrollTop = heightscroll;
    }, [messages]);

    return (
        <div className="flex flex-col gap-y-2.5 w-full max-h-full overflow-y-auto py-2.5" ref={chatRef}>
            {messages.map((message) => (
                <Message
                    message={message}
                    key={message.id}
                />
            ))}
        </div>
    );
};
