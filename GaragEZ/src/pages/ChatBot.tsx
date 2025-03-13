import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Chatbot.module.css";
import { ChatMessage, Product, ChatRequest, ChatResponse } from "../types/chat";
import { RiChatSmile2Line, RiChatSmileAiLine, RiChatAiFill } from "react-icons/ri";
import { IoLogoWechat } from "react-icons/io5";

const ChatBot: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [products, setProducts] = useState<Product[] | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const requestData: ChatRequest = { message: input };
      const response = await axios.post<ChatResponse>("http://localhost:8094/api/chat/message", requestData);

      const botMessage: ChatMessage = { sender: "bot", content: response.data.answer };
      setMessages((prev) => [...prev, botMessage]);

      if (response.data.products) {
        setProducts(response.data.products);
      }

      if (response.data.endChat) {
        setTimeout(() => {
          setMessages([]);
          setProducts(null);
        }, 1000);
      }
    } catch (error) {
      console.error("채팅 오류:", error);
    }
  };

  return (
    <div className={styles.chatbot} style={{ zIndex: 1000 }}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.messageWrapper} ${styles[msg.sender]}`}>
            {msg.sender === "user" ? (
              <div className={styles.userMessage}>
                <RiChatSmileAiLine className={styles.userIcon} />
                <div className={styles.messageBox}>
                  <span className={styles.userLabel}>내 질문</span>
                  <p>{msg.content}</p>
                </div>
              </div>
            ) : (
              <div className={styles.botMessage}>
                <IoLogoWechat className={styles.botIcon} />
                <div className={styles.messageBox}>
                  <span className={styles.botLabel}>답변</span>
                  <p>{msg.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {products && (
          <div className={styles.productList}>
            <h3>🛒 최저가 상품 추천</h3>
            {products.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <img src={product.imageUrl} alt={product.name} />
                <div>
                  <a href={product.link} target="_blank" rel="noopener noreferrer">
                    {product.name}
                  </a>
                  <p>💰 {product.price.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="질문을 입력하세요"
          aria-label="채팅 입력"
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatBot;
