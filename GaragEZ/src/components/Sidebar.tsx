import { useNavigate } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate(); // navigate 훅 사용

  const handleLogout = () => {
    // localStorage에서 정보 삭제
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");

    // 로그아웃 알림 메시지
    alert("로그아웃되었습니다. 다음에 또 방문해주세요!");

    // 홈으로 이동
    navigate("/home"); 

    // 새로고침 (선택적)
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

      {/* 챗봇 */}
      <a href="/chatbot" className={styles.iconWrapper}>
        💬
        <p className={styles.text}>챗봇</p>
      </a>

      {/* 🔥 TOP 아이콘 (div로 변경) */}
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
