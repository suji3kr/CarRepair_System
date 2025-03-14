// src/pages/Landing.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 추가된 코드
import styles from "../styles/Landing.module.css";
import CardrivingVideo from "../images/Cardriving.mp4";

const Landing: React.FC = () => {
  const navigate = useNavigate(); // 추가된 코드
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const overlayTimer = setTimeout(() => setShowOverlay(true), 100);
    const loadingTimer = setTimeout(() => setLoading(false), 3000);

    return () => {
      clearTimeout(overlayTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  const goHome = () => {
    navigate("/home"); // 버튼 클릭 시 '/home'으로 이동
  };

  return (
    <div className={styles.landingRoot}>
      {loading && (
        <div className={`${styles.loadingScreen} ${!loading ? styles.fadeOut : ""}`}>
          <div className={styles.logo}>
            GaragEZ
            <div className={`${styles.logoOverlay} ${showOverlay ? styles.show : ""}`}>
              GaragEZ
            </div>
          </div>
        </div>
      )}

      <div className={`${styles.videoContainer} ${!loading ? styles.fadeIn : ""}`}>
        <video autoPlay muted loop>
          <source src={CardrivingVideo} type="video/mp4" />
        </video>
        <div className={styles.content}>
          <h1>GaragEZ</h1>
          <p>누구나 쉽고 간편한 자동차 수리 예약</p>
          <button className={styles.btn} onClick={goHome}>
            홈페이지 둘러보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
