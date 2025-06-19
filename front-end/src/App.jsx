import { QuestionField } from "./components/QuestionField";
import { MessagesContext } from "./contexts/MessagesContext";
import { Chat } from "./components/Chat";
import { useSendQuestion } from "./hooks/useSendQuestion";
import "./App.css";

function App() {
    const { messages, sendQuestion } = useSendQuestion();

    return (
        <>
            <MessagesContext.Provider value={{ messages }}>
                <Chat />
                <QuestionField sendMessage={sendQuestion} />
            </MessagesContext.Provider>
        </>
    );
}

export default App;
