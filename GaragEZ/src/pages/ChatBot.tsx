import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Chatbot.module.css"; // ✅ CSS 모듈 import

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  link: string;
}

const ChatBot: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [products, setProducts] = useState<Product[] | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post("/api/chat/message", { message: input });
      const botMessage: ChatMessage = { sender: "bot", content: response.data.answer };

      setMessages((prev) => [...prev, botMessage]);

      if (response.data.answer.includes("엔진오일 최저가 검색하시겠습니까?")) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", content: "🔍 엔진오일 최저가 검색하시겠습니까?" },
        ]);
      }
    } catch (error) {
      console.error("채팅 오류:", error);
    }
  };

  const fetchCheapestProducts = async () => {
    try {
      const response = await axios.get("/api/products/cheapest");
      setProducts(response.data);
    } catch (error) {
      console.error("최저가 검색 오류:", error);
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

        {messages.some((msg) => msg.content.includes("🔍 엔진오일 최저가 검색하시겠습니까?")) && (
          <button className={styles.searchButton} onClick={fetchCheapestProducts}>
            ✅ 엔진오일 최저가 검색
          </button>
        )}

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
