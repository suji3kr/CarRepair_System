// components/Layout.tsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import styles from "../styles/Layout.module.css"; // ✅ CSS 모듈 적용

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Sidebar />
      <Footer />
    </div>
  );
};

export default Layout;
