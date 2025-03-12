import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Chatbot.module.css";
import { ChatMessage, Product, ChatRequest, ChatResponse } from "../types/chat"; // ✅ 타입 import

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

      // 만약 챗봇이 최저가 상품 정보를 포함한다면
      if (response.data.products) {
        setProducts(response.data.products);
      }

      // 상담 종료 플래그가 있으면 채팅 초기화
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
          <div key={idx} className={`${styles.message} ${styles[msg.sender]}`}>
            {msg.content}
          </div>
        ))}

        {products && (
          <div className={styles.productList}>
            <h3>🚗 엔진오일 최저가 TOP 5</h3>
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
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatBot;
