import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserPlus, FaSignOutAlt, FaUser, FaUserCircle, FaBars, FaAngleDown } from "react-icons/fa";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUserId = localStorage.getItem("userId");
      const storedEmail = localStorage.getItem("userEmail");
      const googleUser = localStorage.getItem("googleUser");
      const storedUserRole = localStorage.getItem("userRole");
      if (storedUserId || storedEmail) {
        setIsLoggedIn(true);
        setUserId(storedUserId);
        setUserEmail(storedEmail);
        setIsGoogleUser(!!googleUser);
        setUserRole(storedUserRole);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setUserEmail(null);
        setIsGoogleUser(false);
        setUserRole(null);
      }
    };
    checkLoginStatus();
    const storageListener = () => checkLoginStatus();
    window.addEventListener("storage", storageListener);
    return () => window.removeEventListener("storage", storageListener);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("googleUser");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserId(null);
    setUserEmail(null);
    setIsGoogleUser(false);
    setUserRole(null);
    if (isGoogleUser && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    alert("로그아웃되었습니다. 다음에 또 방문해주세요!");
    navigate("/home");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) setOpenSubmenu(null);
  };

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const displayName = userEmail ? userEmail.split("@")[0] : userId;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link to="/home">
            <img src="/images/gez-logo(w).png" alt="GarageEZ Logo" />
          </Link>
        </div>

        <button className={styles.hamburger} onClick={toggleMobileMenu}>
          <FaBars />
        </button>

        <div className={`${styles.menuWrapper} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}>
          <ul className={styles.menu}>
            {userRole === "ADMIN" ? (
              <>
                <li><Link to="/admin/users">회원관리</Link></li>
                <li><Link to="/admin/cars">차량관리</Link></li>
                <li><Link to="/admin/reservations">예약관리</Link></li>
                <li><Link to="/admin/partshop">부품샵 관리</Link></li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/about">회사소개</Link>
                  <button onClick={() => toggleSubmenu("about")} className={styles.menuButton}>
                    <FaAngleDown />
                  </button>
                  <ul className={`${styles.submenu} ${openSubmenu === "about" ? styles.open : ""}`}>
                    <li><Link to="/menu1/CompanyHistory">회사 연혁</Link></li>
                    <li><Link to="/menu1/team">팀 소개</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="/contact">견적·상담</Link>
                  <button onClick={() => toggleSubmenu("contact")} className={styles.menuButton}>
                    <FaAngleDown />
                  </button>
                  <ul className={`${styles.submenu} ${openSubmenu === "contact" ? styles.open : ""}`}>
                    <li><Link to="/contact">견적 요청</Link></li>
                    <li><Link to="/Cars">차량별 문의</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="/partshop">부품샵</Link>
                  <button onClick={() => toggleSubmenu("partshop")} className={styles.menuButton}>
                    <FaAngleDown />
                  </button>
                  <ul className={`${styles.submenu} ${openSubmenu === "partshop" ? styles.open : ""}`}>
                    <li><Link to="/partshop">엔진 부품</Link></li>
                    <li><Link to="/partshop/interior">인테리어 부품</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="/event">이벤트</Link>
                  <button onClick={() => toggleSubmenu("event")} className={styles.menuButton}>
                    <FaAngleDown />
                  </button>
                  <ul className={`${styles.submenu} ${openSubmenu === "event" ? styles.open : ""}`}>
                    <li><Link to="/event">진행 중 이벤트</Link></li>
                    <li><Link to="/PastEvents">지난 이벤트</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="/map">가까운 가게</Link>
                  <button onClick={() => toggleSubmenu("map")} className={styles.menuButton}>
                    <FaAngleDown />
                  </button>
                  <ul className={`${styles.submenu} ${openSubmenu === "map" ? styles.open : ""}`}>
                    <li><Link to="/map">지도 검색</Link></li>
                    <li><Link to="/StoreList">목록 보기</Link></li>
                    <li><Link to="/StoreReview">가게별 리뷰</Link></li>
                  </ul>
                </li>
              </>
            )}
          </ul>

          {userRole !== "ADMIN" && (
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
                      <li><Link to="/contact">견적 요청</Link></li>
                      <li><Link to="/Cars">차량별 문의</Link></li>
                    </ul>
                  </div>
                  <div className={styles.category}>
                    <h3>부품샵</h3>
                    <ul>
                      <li><Link to="/partshop">엔진 부품</Link></li>
                      <li><Link to="/partshop/interior">인테리어 부품</Link></li>
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
          )}
        </div>

        <div className={styles.authButtons}>
          {isLoggedIn ? (
            <>
              <span className={styles.welcomeText}>
                {displayName}님 환영합니다
              </span>
              {userRole !== "ADMIN" && (
                <Link to="/cart" className={styles.cartButton} title="장바구니">
                  <FaShoppingCart className={styles.cartIcon} />
                </Link>
              )}
              <Link to="/profile" className={styles.profileButton} title="내 정보">
                <FaUserCircle className={styles.profileIcon} />
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