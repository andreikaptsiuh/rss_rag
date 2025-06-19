import { useCallback, useEffect, useState } from "react";

export const QuestionField = ({ sendMessage }) => {
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const changeQuestionHandler = (e) => {
        setQuestion(e.target.value);
    };

    const sendQuestion = async () => {
        if (question === "") return;

        setIsLoading(true);
        const sendedQuestion = question;
        setQuestion("");

        await sendMessage(sendedQuestion);
        setIsLoading(false);
    };

    const keyPressHandler = useCallback(
        async (e) => {
            if (e.key === "Enter" && question !== "") {
                await sendQuestion(question);
            }
        },
        [question]
    );

    useEffect(() => {
        window.addEventListener("keydown", keyPressHandler);

        return () => window.removeEventListener("keydown", keyPressHandler);
    }, [keyPressHandler]);

    return (
        <div className="w-full flex justify-center self-end mb-2.5 pt-2.5">
            <textarea
                className="peer w-full h-16 rounded-l-lg border-1 border-gray-600 resize-none, p-2.5"
                style={{ resize: "none" }}
                name="question"
                placeholder="Задать вопрос"
                value={question}
                onChange={changeQuestionHandler}
                disabled={isLoading}
            />
            <button
                className="rounded-r-lg border-1 border-gray-600"
                onClick={sendQuestion}
            >
                {isLoading ? (
                    <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
                    </div>
                ) : (
                    "Отправить"
                )}
            </button>
        </div>
    );
};
