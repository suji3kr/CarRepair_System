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

            {/* ✅ 추가된 주소, 이메일, 전화번호 */}
            <div className={styles.footerInfo}>
              <p>📍 서울시 강남구 테헤란로 123, 10층</p>
              <p>📧 <a href="mailto:support@chagoji.com">support@chagoji.com</a></p>
              <p>📞 <a href="tel:0212345678">02-1234-5678</a></p>
            </div>
          </div>

          {/* 푸터 링크 목록 */}
          <div className={styles.footerLinks}>
            {/* 회사소개 */}
            <div className={styles.footerColumn}>
              <h3>회사소개</h3>
              <ul>
                <li><Link to="/menu1/history">회사 연혁</Link></li>
                <li><Link to="/menu1/team">팀 소개</Link></li>
              </ul>
            </div>

            {/* 견적·상담 */}
            <div className={styles.footerColumn}>
              <h3>견적·상담</h3>
              <ul>
                <li><Link to="/menu2/estimate">견적 요청</Link></li>
                <li><Link to="/menu2/contact">문의하기</Link></li>
              </ul>
            </div>

            {/* 부품샵 */}
            <div className={styles.footerColumn}>
              <h3>부품샵</h3>
              <ul>
                <li><Link to="/menu3/engine">엔진 부품</Link></li>
                <li><Link to="/menu3/interior">인테리어 부품</Link></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
