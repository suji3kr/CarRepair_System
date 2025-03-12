import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserPlus, FaSignOutAlt, FaUser } from "react-icons/fa";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // ✅ 일반 로그인 사용자 ID
  const [userEmail, setUserEmail] = useState<string | null>(null); // ✅ 구글 로그인 사용자 이메일
  const navigate = useNavigate();

  // ✅ 로그인 상태 확인 (localStorage 값 변경 시 즉시 반영)
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUserId = localStorage.getItem("userId");
      const storedEmail = localStorage.getItem("userEmail");
  
      if (storedUserId || storedEmail) {
        setIsLoggedIn(true);
        setUserId(storedUserId);
        setUserEmail(storedEmail);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setUserEmail(null);
      }
    };
  
    checkLoginStatus(); // 최초 실행
  
    // ✅ 다른 탭에서 localStorage 변경 감지
    const storageListener = () => {
      checkLoginStatus();
    };
  
    window.addEventListener("storage", storageListener);
  
    return () => {
      window.removeEventListener("storage", storageListener);
    };
  }, []);

  // ✅ 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");

    setIsLoggedIn(false);
    setUserId(null);
    setUserEmail(null);

    // 로그아웃 알림 메시지
    alert("로그아웃되었습니다. 다음에 또 방문해주세요!");
    
    navigate("/home"); // 홈으로 이동
    window.location.reload(); // 새로고침 (선택적)
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link to="/home">
            <img src="/images/gez-logo(w).png" alt="GarageEZ Logo" />
          </Link>
        </div>


        <div className={styles.menuWrapper}>
          <ul className={styles.menu}>
            <li><Link to="/about">회사소개</Link></li>
            <li><Link to="/contact">견적·상담</Link></li>
            <li><Link to="/partshop">부품샵</Link></li>
            <li><Link to="/event">이벤트</Link></li>
            <li><Link to="/map">가까운 가게</Link></li>
          </ul>

          {/* 전체 화면을 덮는 드롭다운 박스 */}
          <div className={styles.dropdownContainer}>
            <div className={styles.dropdownBox}>
              <div className={styles.dropdownContent}>
                <div className={styles.category}>
                  <h3>회사소개</h3>
                  <ul>
                    <li><Link to="/menu1/CompanyHistory">회사 연혁</Link></li>
                    <li><Link to="/menu1/team">팀 소개</Link></li>
                  </ul>
                </div>
                <div className={styles.category}>
                  <h3>견적·상담</h3>
                  <ul>
                    <li><Link to="/menu2/estimate">견적 요청</Link></li>
                    <li><Link to="/contact">문의하기</Link></li>
                    <li><Link to="/Cars">차량별 문의</Link></li>
                  </ul>
                </div>
                <div className={styles.category}>
                  <h3>부품샵</h3>
                  <ul>
                    <li><Link to="/menu3/engine">엔진 부품</Link></li>
                    <li><Link to="/menu3/interior">인테리어 부품</Link></li>
                  </ul>
                </div>
                <div className={styles.category}>
                  <h3>이벤트</h3>
                  <ul>
                    <li><Link to="/event">진행 중 이벤트</Link></li>
                    <li><Link to="/PastEvents">지난 이벤트</Link></li>
                  </ul>
                </div>
                <div className={styles.category}>
                  <h3>가까운 가게</h3>
                  <ul>
                    <li><Link to="/map">지도 검색</Link></li>
                    <li><Link to="/StoreList">목록 보기</Link></li>
                    <li><Link to="/StoreReview">가게별 리뷰</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ✅ 로그인 상태에 따라 UI 변경 */}
        <div className={styles.authButtons}>
          {isLoggedIn ? (
            <>
              <span className={styles.welcomeText}>
                {userEmail ? `${userEmail}님 환영합니다` : `${userId}님 환영합니다`}
              </span>

              <Link to="/cart" className={styles.cartButton} title="장바구니">
                <FaShoppingCart className={styles.cartIcon} />
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton} title="로그아웃">
                <FaSignOutAlt className={styles.logoutIcon} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginButton} title="로그인">
                <FaUser className={styles.loginIcon} />
              </Link>
              <Link to="/signup" className={styles.signupButton} title="회원가입">
                <FaUserPlus className={styles.signupIcon} />
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
