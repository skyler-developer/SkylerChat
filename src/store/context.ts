import { createContext, useContext } from "react";
import type { MessageInstance } from "antd/es/message/interface";

export const messageContext = createContext<MessageInstance>(null);

export const useMessageContext = () => {
    return useContext(messageContext);
};
