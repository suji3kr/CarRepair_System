import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link to="/home">
          <img src="/images/gez-logo(w).png" alt="GarageEZ Logo" />
        </Link>
      </div>

        <ul className={styles.menu}>
          <li><Link to="/menu1">Menu1</Link></li>
          <li><Link to="/menu2">Menu2</Link></li>
          <li><Link to="/menu3">Menu3</Link></li>
          <li><Link to="/menu4">Menu4</Link></li>
          <li><Link to="/chat-bot">Menu5</Link></li>
        </ul>

        <button className={styles.searchButton}>
          🔍
        </button>
      </nav>
    </header>
  );
};

export default Header;
