import React, { createContext, useContext, useState } from "react";

interface ChatBotContextProps {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
}

const ChatBotContext = createContext<ChatBotContextProps | undefined>(undefined);

export const ChatBotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <ChatBotContext.Provider value={{ isChatOpen, openChat, closeChat }}>
      {children}
    </ChatBotContext.Provider>
  );
};

export const useChatBot = (): ChatBotContextProps => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error("useChatBot must be used within a ChatBotProvider");
  }
  return context;
};
