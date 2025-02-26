import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"; // React Icons 추가
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
      {/* 상단 영역 */}
      <div className={styles.footerTop}>
        <div className={styles.footerText}>
          <h2>Always with GaragEZ</h2>
          <p>차고지가 여러분의 차를 책임집니다.</p>
        </div>
        <div className={styles.footerLogos}>
          <img src="/images/gez-logo(w).png" alt="GaragEZ Logo" style={{ width: "7%", height: "auto" }} />
          <a href="http://pf.kakao.com/_xoxgfxjn"><img src="/images/kakaotalk.png" alt="KakaoTalk" /></a>
          <img src="/images/chatbot.png" alt="ChatBot" />
        </div>
      </div>

      {/* 하단 영역 */}
      <div className={styles.footerBottom}>
        {/* 사이트 네임 및 소셜 아이콘 */}
        <div className={styles.footerSite}>
        <h3 style={{ fontFamily: "'SF Chaerilidae', sans-serif" }}>GaragEZ</h3>
          <div className={styles.footerIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className={styles.icon} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className={styles.icon} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className={styles.icon} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className={styles.icon} />
            </a>
          </div>
        </div>

        {/* 푸터 링크 목록 */}
        <div className={styles.footerLinks}>
          {[1, 2, 3].map((topic) => (
            <div key={topic} className={styles.footerColumn}>
              <h3>Topic</h3>
              <ul>
                <li><Link to="#">Page</Link></li>
                <li><Link to="#">Page</Link></li>
                <li><Link to="#">Page</Link></li>
              </ul>
            </div>
          ))}
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
