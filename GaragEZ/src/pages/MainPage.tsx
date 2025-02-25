import React from "react";
import styles from "../styles/MainPage.module.css";
import Layout from "../components/Layout";

const MainPage: React.FC = () => {
  return (
    <Layout>
      <div className={styles.mainContainer}>
        {/* Hero Section */}
        <section className={styles.heroSection}></section>

        {/* Navigation Icons */}
        <nav className={styles.navIcons}>
          {["타이어", "엔진오일", "배터리", "악세사리", "튜닝", "세차", "차량용품", "이벤트"].map((item, idx) => (
            <button key={idx} className={styles.navButton}>
              <div className={styles.iconPlaceholder}></div>
              <span>{item}</span>
            </button>
          ))}
        </nav>

        {/* 배너 자리 */}
        <section className={styles.bannerSection}>
          <img src="/special-event-banner.jpg" alt="이벤트 배너" className={styles.bannerImg} />
        </section>

        {/* Section Heading */}
        <section className={styles.sectionHeading}>
          <h2>Section heading</h2>
          <p className={styles.subheading}>Subheading</p>
          <p className={styles.subheading}>Subheading</p>
          <p className={styles.subheading}>Subheading</p>
          <div className={styles.buttonGroup}>
            <button className={styles.primaryButton}>Button</button>
            <button className={styles.secondaryButton}>Secondary button</button>
          </div>
        </section>

        {/* Event & ItemShop Section */}
        <section className={styles.eventItemShop}>
          <div className={styles.event}>
            <img src="/event-image.jpg" alt="Event" className={styles.sectionImg} />
            <h3>Event</h3>
            <p className={styles.sectionSubheading}>Subheading</p>
          </div>
          <div className={styles.itemShop}>
            <img src="/itemshop-image.jpg" alt="ItemShop" className={styles.sectionImg} />
            <h3>ItemShop</h3>
            <p className={styles.sectionSubheading}>Subheading</p>
          </div>
        </section>

        {/* 차고지 리뷰 */}
        <section className={styles.reviews}>
          <h2>차고지 리뷰</h2>
          <div className={styles.reviewCards}>
            {["A terrific place of praise", "A fantastic bit of feedback", "A genuinely glowing review"].map((review, idx) => (
              <div key={idx} className={styles.reviewCard}>
                <p className={styles.reviewText}>"{review}"</p>
                <div className={styles.reviewAuthor}>Name</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MainPage;
