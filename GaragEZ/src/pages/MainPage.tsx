import React, { useEffect, useState } from "react";
import styles from "../styles/MainPage.module.css";
import Layout from "../components/Layout";
import { Review } from "./review/ReviewBoard";
import axios from "axios";
import TireRepairIcon from '@mui/icons-material/Build'; // TireRepair 아이콘 대체
import CarRepairIcon from '@mui/icons-material/DirectionsCar'; // CarRepair 아이콘 대체
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import HandymanIcon from '@mui/icons-material/Handyman';
import BuildIcon from '@mui/icons-material/Build';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import GarageIcon from '@mui/icons-material/Garage';
import CelebrationIcon from '@mui/icons-material/Celebration';



const MainPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    axios.get<Review[]>(`${import.meta.env.VITE_API_URL}/api/reviews`)
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('리뷰를 불러오는 중 오류 발생:', error);
      });
  }, []);

  return (
    <Layout>
      <div className={styles.mainContainer}>
        {/* Hero Section */}
        <section className={styles.heroSection}></section>

        {/* Navigation Icons */}
        <nav className={styles.navIcons}>
      {["타이어", "엔진오일", "배터리", "악세사리", "튜닝", "세차", "차량용품", "이벤트"].map((item, idx) => (
        <button key={idx} className={styles.navButton}>
          <div className={styles.iconPlaceholder}>
            {idx === 0 && <TireRepairIcon className={styles.navIcon} />}
            {idx === 1 && <CarRepairIcon className={styles.navIcon} />}
            {idx === 2 && <BatteryAlertIcon className={styles.navIcon} />}
            {idx === 3 && <HandymanIcon className={styles.navIcon} />}
            {idx === 4 && <BuildIcon className={styles.navIcon} />}
            {idx === 5 && <CleaningServicesIcon className={styles.navIcon} />}
            {idx === 6 && <GarageIcon className={styles.navIcon} />}
            {idx === 7 && <CelebrationIcon className={styles.navIcon} />}
          </div>
          <span>{item}</span>
        </button>
      ))}
    </nav>

        {/* 배너 자리 */}
        <section className={styles.bannerSection}>
          <img src="images/event.png" alt="이벤트 배너" className={styles.bannerImg} />
        </section>

{/* Section Heading + Image 컨테이너 */}
<section className={styles.sectionContainer}>
  {/* 왼쪽: Section Heading */}
  <div className={styles.sectionHeading}>
    <h2>Section heading</h2>
    <p className={styles.subheading}>Subheading</p>
    <p className={styles.subheading}>Subheading</p>
    <p className={styles.subheading}>Subheading</p>

    <div className={styles.buttonGroup}>
      <button className={styles.primaryButton}>Button</button>
      <button className={styles.secondaryButton}>Secondary button</button>
    </div>
  </div>


</section>


        {/* Event & ItemShop Section */}
        <section className={styles.eventItemShop}>
          <div className={styles.event}>
            <img src="images/pears.png" alt="Event" className={styles.sectionImg} />
            <h3>Event</h3>
            <p className={styles.sectionSubheading}>Subheading</p>
          </div>
          <div className={styles.itemShop}>
            <img src="images/fruits.png" alt="ItemShop" className={styles.sectionImg} />
            <h3>ItemShop</h3>
            <p className={styles.sectionSubheading}>Subheading</p>
          </div>
        </section>

        {/* 차고지 리뷰 */}
        <section className={styles.reviews}>
          <h2>차고지 리뷰</h2>
          <div className={styles.reviewCards}>
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className={styles.reviewCard}>
                  <p className={styles.reviewText}>"{review.content}"</p>
                  <div className={styles.reviewAuthor}>{review.user.username}</div>
                  <div className={styles.reviewDate}>{new Date(review.createdAt).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <p className={styles.noReviews}>작성된 리뷰가 없습니다.</p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MainPage;
