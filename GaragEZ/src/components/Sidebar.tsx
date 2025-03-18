import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { useChatBot } from "../context/ChatBotContext"; // ✅ 전역 상태 사용
import styles from "../styles/Sidebar.module.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { openChat } = useChatBot(); // ✅ 챗봇 열기 함수 가져오기
  const [isOpen, setIsOpen] = useState(false); // ✅ 사이드바 상태 추가

  // ✅ 모바일에서 버튼 클릭 시 토글
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // ✅ 스와이프 이벤트 핸들러 (모바일 전용)
  const handlers = useSwipeable({
    onSwipedRight: () => setIsOpen(true), // 👉 오른쪽 스와이프하면 열림
    onSwipedLeft: () => setIsOpen(false), // 👉 왼쪽 스와이프하면 닫힘
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // ✅ 로그아웃 기능
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    alert("로그아웃되었습니다. 다음에 또 방문해주세요!");
    navigate("/home");
    window.location.reload();
  };

  return (
    <>
      {/* ✅ 모바일에서만 보이는 토글 버튼 */}
      <div className={styles.mobileToggleButton} onClick={toggleSidebar}>
        메뉴
      </div>

      {/* ✅ 스와이프 이벤트 적용 */}
      <div
        {...handlers}
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
      >
        {/* 견적 문의 */}
        <a href="/contact" className={styles.iconWrapper}>
          🔧 <p className={styles.text}>견적</p>
        </a>

        {/* 부품 샵 */}
        <a href="/partshop" className={styles.iconWrapper}>
          🏪 <p className={styles.text}>부품샵</p>
        </a>

        {/* 장바구니 */}
        <a href="/cart" className={styles.iconWrapper}>
          🛒 <p className={styles.text}>장바구니</p>
        </a>

        {/* 챗봇 버튼 */}
        <div className={styles.iconWrapper} onClick={openChat}>
          💬 <p className={styles.text}>챗봇</p>
        </div>

        {/* 🔥 TOP 아이콘 */}
        <div className={styles.topIcon} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ⬆️ <p className={styles.text}>TOP</p>
        </div>

        {/* 로그아웃 버튼 */}
        <button className={styles.logoutButton} onClick={handleLogout}>
          🚪 <p className={styles.text}>로그아웃</p>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
