import { createContext } from "react";

const initialState = {
    messages: [],
};

export const MessagesContext = createContext(initialState);
