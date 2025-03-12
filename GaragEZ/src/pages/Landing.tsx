// src/pages/Landing.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Landing.module.css";
import CardrivingVideo from "../images/Cardriving.mp4";

// ✅ 라이브챗 컴포넌트 임포트
import LiveChat from "../components/LiveChat";

const Landing: React.FC = () => {
  const navigate = useNavigate();
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
    navigate("/home");
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
          <h1>소중한 당신의 자동차를 위한 선택</h1>
          <p>수리는 저희에게 맡기세요</p>
          <button className={styles.btn} onClick={goHome}>
            더 알아보기
          </button>
        </div>
      </div>

      {/* ✅ Landing 페이지에만 라이브챗 표시 */}
      <LiveChat />
    </div>
  );
};

export default Landing;
