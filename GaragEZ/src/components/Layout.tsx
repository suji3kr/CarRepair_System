// components/Layout.tsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import LiveChat from "./LiveChat";
import styles from "../styles/Layout.module.css"; // 예: Layout.module.css

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>{children}</main>
        <aside className={styles.liveChatSidebar}>
          <LiveChat />
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
