import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import styles from "../styles/LiveChat.module.css";

interface ChatMessage {
  sender: string;
  content: string;
}

const LiveChat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    console.log("LiveChat mounted");
    const socket = new SockJS("http://localhost:8092/ws-chat"); // URL 확인
    const client = Stomp.over(socket);
    // client.debug = () => {}; // 디버그 로그 끄기
    client.connect(
      {},
      () => {
        console.log("WebSocket 연결 성공");
        client.subscribe("/topic/public", (msg) => {
          if (msg.body) {
            try {
              const received: ChatMessage = JSON.parse(msg.body);
              console.log("수신된 메시지:", received);
              setChat((prev) => [...prev, received]);
            } catch (error) {
              console.error("메시지 파싱 에러:", error);
            }
          }
        });
      },
      (error) => {
        console.error("WebSocket 연결 에러:", error);
      }
    );
    stompClientRef.current = client;

    return () => {
      console.log("LiveChat unmounting");
      if (client && client.connected) {
        client.disconnect(() => {
          console.log("WebSocket 연결 종료");
        });
      }
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (stompClientRef.current && stompClientRef.current.connected && message.trim() !== "") {
      const msgObj: ChatMessage = { sender: "사용자", content: message };
      stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(msgObj));
      setMessage("");
    }
  };

  return (
    <div className={styles.liveChatContainer}>
      <h2>실시간 라이브챗</h2>
      <div className={styles.chatBox}>
        {chat.map((msg, idx) => (
          <div key={idx} className={styles.chatMessage}>
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className={styles.chatForm}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className={styles.chatInput}
        />
        <button type="submit" className={styles.sendButton}>
          전송
        </button>
      </form>
    </div>
  );
};

export default LiveChat;
