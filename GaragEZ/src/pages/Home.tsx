import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css"; // ✅ CSS Modules 사용

const easeInOutCubic = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// ✅ smoothScrollTo 함수를 useEffect 바깥으로 이동
const smoothScrollTo = (element: HTMLElement, target: number, duration: number, setHideImage: React.Dispatch<React.SetStateAction<boolean>>) => {
  const start = element.scrollTop;
  const change = target - start;
  const startTime = performance.now();

  element.classList.remove("active");

  const animateScroll = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    element.scrollTop = start + change * easeInOutCubic(progress);

    if (progress < 1) {
      window.requestAnimationFrame(animateScroll);
    } else {
      element.classList.add("active");
    }
  };

  setHideImage(false);
  window.requestAnimationFrame(animateScroll);
};

const Home: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hideImage, setHideImage] = useState(false);

  useEffect(() => {
    const container = document.querySelector(`.${styles.snapContainer}`) as HTMLElement;
    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let autoScrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let idleTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleUserActivity = () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = window.setTimeout(autoScroll, 5000);
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      isScrolling = true;
      handleUserActivity();

      const sections = container.querySelectorAll("section");
      const currentScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      const currentIndex = Math.floor(currentScrollTop / containerHeight);
      const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + (e.deltaY > 0 ? 1 : -1)));

      setActiveIndex(nextIndex);
      smoothScrollTo(container, nextIndex * containerHeight, 1300, setHideImage);

      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 1400);

      e.preventDefault();
    };

    const autoScroll = () => {
      if (isScrolling) return;

      const sections = container.querySelectorAll("section");
      const totalSections = sections.length;
      const containerHeight = container.clientHeight;
      const currentScrollTop = container.scrollTop;

      const currentIndex = Math.floor(currentScrollTop / containerHeight);
      const isLastPage = currentIndex === totalSections - 1;
      const nextIndex = isLastPage ? 0 : currentIndex + 1;

      setActiveIndex(nextIndex);
      const delay = isLastPage ? 6000 : 3500;

      smoothScrollTo(container, nextIndex * containerHeight, 1300, setHideImage);
      autoScrollTimeout = window.setTimeout(autoScroll, delay);
    };

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleUserActivity);
      document.addEventListener("keydown", handleUserActivity);

      autoScrollTimeout = window.setTimeout(autoScroll, 3500);

      return () => {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleUserActivity);
        document.removeEventListener("keydown", handleUserActivity);
        if (scrollTimeout) clearTimeout(scrollTimeout);
        if (autoScrollTimeout) clearTimeout(autoScrollTimeout);
        if (idleTimeout) clearTimeout(idleTimeout);
      };
    }
  }, []);

  return (
    <div style={{ width: "100vw" }}>
      {/* ✅ 목차를 화면에 고정 */}
      <div className={styles.navContainer}>
        {["Main", "About Us", "Consult", "PartShop"].map((title, index) => (
          <div 
            key={index} 
            className={`${styles.navItem} ${activeIndex === index ? styles.activeNav : ""}`}
            onClick={() => {
              setActiveIndex(index);
              setHideImage(false);
              const container = document.querySelector(`.${styles.snapContainer}`) as HTMLElement;
              smoothScrollTo(container, index * window.innerHeight, 1300, setHideImage);
            }}
          >
            {title}
          </div>
        ))}
      </div>

      <div className={styles.snapContainer}>
        {[
          { img: "/images/cars.jpg", alt: "Cars", link: "/main", text: "차고지 바로가기" },
          { img: "/images/mechanic.jpg", alt: "Mechanic", link: "/about", text: "차고지 회사소개" },
          { img: "/images/consult.jpg", alt: "Consult", link: "/contact", text: "견적 · 상담 받기" },
          { img: "/images/repair.jpg", alt: "Repair", link: "/partshop", text: "부품 장만하러 가기" }
        ].map((item, index) => (
          <section key={index} className={styles.section}>
            <img src={item.img} alt={item.alt} className={hideImage ? styles.hidden : ""} />
            <div className={styles.buttonContainer}>
              <Link to={item.link} className={styles.pageButton}>{item.text}</Link>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Home;
