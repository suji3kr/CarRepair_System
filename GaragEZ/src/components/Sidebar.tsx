import styles from "../styles/Sidebar.module.css";

const Sidebar: React.FC = () => {
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
    </div>
  );
};

export default Sidebar;
