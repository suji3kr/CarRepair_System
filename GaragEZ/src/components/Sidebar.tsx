import { useNavigate } from "react-router-dom";
import { useChatBot } from "../context/ChatBotContext"; // ✅ 전역 상태 사용
import styles from "../styles/Sidebar.module.css";


const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  
  const { openChat } = useChatBot(); // ✅ 챗봇 열기 함수 가져오기

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    alert("로그아웃되었습니다. 다음에 또 방문해주세요!");
    navigate("/home");
    window.location.reload();
  };

  return (
    <div className={styles.sidebar}>
      {/* 견적 문의 */}
      <a href="/contact" className={styles.iconWrapper}>
        🔧
        <p className={styles.text}>견적</p>
      </a>

      {/* 부품 샵 */}
      <a href="/partshop" className={styles.iconWrapper}>
        🏪
        <p className={styles.text}>부품샵</p>
      </a>

      {/* 장바구니 */}
      <a href="/cart" className={styles.iconWrapper}>
        🛒
        <p className={styles.text}>장바구니</p>
      </a>

      {/* 챗봇 버튼 */}
      <div className={styles.iconWrapper} onClick={openChat}>
        💬
        <p className={styles.text}>챗봇</p>
      </div>

      {/* 🔥 TOP 아이콘 */}
      <div
        className={styles.topIcon}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ⬆️
      </div>

      {/* 로그아웃 버튼 */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        🚪
        <p className={styles.text}>로그아웃</p>
      </button>
    </div>
  );
};

export default Sidebar;
