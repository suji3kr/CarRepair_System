import { useState } from "react";
import styles from "../styles/Event.module.css";
import Layout from "../components/Layout";

// 배너 데이터 타입 정의
interface Event {
  imageUrl: string;
  link: string;
}

const Event: React.FC = () => {
  // 배너 데이터 (백엔드 없이 하드코딩)
  const [event] = useState<Event[]>([
    { imageUrl: "/images/Event1.jpg", link: "https://example.com/event1" },
    { imageUrl: "/images/Event2.jpg", link: "https://example.com/event2" },
    { imageUrl: "/images/Event3.jpg", link: "https://example.com/event3" },
    { imageUrl: "/images/Event4.jpg", link: "https://www.skzic.com/index.do" },
  ]);

  return (
    <Layout>
      <div className={styles.eventContainer}>
      <h2 className={styles.eventTitle}>차고지의 이벤트</h2>
      <p className={styles.eventDescription}>방문해주셔서 감사합니다.</p>

      <div className={styles.eventContainer}>
        {event.map((event, index) => (
          <a key={index} href={event.link} target="_blank" rel="noopener noreferrer">
            <img src={event.imageUrl} alt={`Event Banner ${index + 1}`} className={styles.eventImage} />
            <br></br><br></br>
          </a>
        ))}
      </div>
    </div>
  </Layout>
  );
};

export default Event;
