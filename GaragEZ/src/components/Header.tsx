import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa"; // 로그인 아이콘
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
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
            <li><Link to="/menu1">회사소개</Link></li>
            <li><Link to="/menu2">견적·상담</Link></li>
            <li><Link to="/menu3">부품샵</Link></li>
            <li><Link to="/menu4">이벤트</Link></li>
            <li><Link to="/menu5">가까운 가게</Link></li>
          </ul>

          {/* 전체 화면을 덮는 드롭다운 박스 */}
          <div className={styles.dropdownContainer}>
            <div className={styles.dropdownBox}>
              <div className={styles.dropdownContent}>
                <div className={styles.category}>
                  <h3>회사소개</h3>
                  <ul>
                    <li><Link to="/menu1/history">회사 연혁</Link></li>
                    <li><Link to="/menu1/team">팀 소개</Link></li>
                  </ul>
                </div>
                <div className={styles.category}>
                  <h3>견적·상담</h3>
                  <ul>
                    <li><Link to="/menu2/estimate">견적 요청</Link></li>
                    <li><Link to="/menu2/contact">문의하기</Link></li>
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
                    <li><Link to="/menu4/ongoing">진행 중 이벤트</Link></li>
                    <li><Link to="/menu4/past">지난 이벤트</Link></li>
                  </ul>
                </div>
                <div className={styles.category}>
                  <h3>가까운 가게</h3>
                  <ul>
                    <li><Link to="/menu5/map">지도 검색</Link></li>
                    <li><Link to="/menu5/list">목록 보기</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <Link to="/login" className={styles.loginButton}>
          <FaUser className={styles.loginIcon} /> 로그인
        </Link>
      </nav>
    </header>
  );
};

export default Header;
