// pages/Home.tsx
import React, { useEffect } from "react";
import styled from "@emotion/styled";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SnapContainer = styled.div`
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;

  /* 브라우저별 스크롤바 숨기기 */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar { /* 나머지: chrome, opera 등 */
    display: none;
  }
  
  & > section {
    height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow:hidden;
  }
`;

const ImageSection = styled.section`
  /* 섹션 내 내용물을 완전히 채우도록 설정 */
  & img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지 비율을 유지하면서 영역을 완전히 채움 */
    object-position: center; /* 이미지의 중앙을 표시 */
  }
`;

const Home: React.FC = () => {
  useEffect(() => {
    // 휠 이벤트를 최적화하기 위한 쓰로틀링 함수
    let isScrolling = false;
    const container = document.querySelector('.snap-container');
    
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      isScrolling = true;
      
      const container = e.currentTarget as HTMLElement;
      const sections = container.querySelectorAll('section');
      const containerHeight = container.clientHeight;
      const currentScrollTop = container.scrollTop;
      
      // 현재 보이는 섹션의 인덱스 계산
      const currentIndex = Math.round(currentScrollTop / containerHeight);
      
      // 스크롤 방향 결정
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
      
      // 다음 섹션으로 부드럽게 스크롤
      container.scrollTo({
        top: nextIndex * containerHeight,
        behavior: 'smooth'
      });
      
      // 스크롤 완료 후 플래그 재설정
      setTimeout(() => {
        isScrolling = false;
      }, 800); // 스크롤 애니메이션 시간보다 약간 더 길게 설정
      
      e.preventDefault();
    };
    
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);


    return (
    <div style={{width:'100vw'}}>
        <Header />
        <SnapContainer>
            <section><h1>환영합니다!</h1></section>
            <ImageSection><img src="/images/cars.jpg" alt="" style={{ width: "100%" }} /></ImageSection>
            <ImageSection><img src="/images/mechanic.jpg" alt="" style={{ width: "100%" }} /></ImageSection>
            <ImageSection><img src="/images/consult.jpg" alt="" style={{ width: "100%" }} /></ImageSection>
            <ImageSection><img src="/images/repair.jpg" alt="" style={{ width: "100%" }} /></ImageSection>
            <section style={{backgroundColor:"#121212"}}><Footer /></section>
        </SnapContainer>
    </div>
    );
};

export default Home;