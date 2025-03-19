import { useEffect } from "react";
import styles from "../styles/About.module.css";
import Layout from "../components/Layout"; // Layout 컴포넌트 적용

export default function About() {
  useEffect(() => {
    console.log("About 페이지 로드됨");
  }, []);

  // 자동차 수리 전문가 정보
  const mechanics = [
    {
      name: "김지원",
      role: "수석 엔지니어",
      specialty: "엔진 및 전기 시스템 전문가",
      image: "/images/mechanic1.jpg",
    },
    {
      name: "박민서",
      role: "정비 매니저",
      specialty: "차량 정비 및 유지보수",
      image: "/images/mechanic2.jpg",
    },
    {
      name: "유인수",
      role: "브레이크 시스템 전문가",
      specialty: "서스펜션 및 브레이크 전문가",
      image: "/images/mechanic3.jpg",
    },
    {
      name: "박상욱",
      role: "트럭 정비 팀장",
      specialty: "트럭 및 대형 차량 정비",
      image: "/images/mechanic4.jpg",
    },
    {
      name: "최성민",
      role: "진단 전문가",
      specialty: "자동차 진단 및 수리",
      image: "/images/mechanic5.jpg",
    },
  ];

  return (
    <Layout>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1>차고지, 차량 유지보수의 모든 것</h1>
          <p>전문가와 함께하는 쉽고 편리한 자동차 관리 서비스</p>
        </section>

        {/* <section className={styles.aboutUs}>
          <h2>차고지, 자동차 유지보수의 혁신을 이끕니다</h2>
          <p>우리는 차량 유지보수 시장을 보다 투명하고 효율적으로 만들기 위해 시작되었습니다.</p>
        </section> */}

        {/* YouTube 비디오 섹션 */}
        <section className={styles.videoSection}>
          <h2>차고지 소개 영상</h2>
          <div className={styles.videoWrapper}>
            <iframe
              width="1250"
              height="703"
              src="https://www.youtube.com/embed/ZtAoyW7vyzo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <section className={styles.services}>
          <h2>차고지가 제공하는 서비스</h2>
          <div className={styles.serviceContainer}>
            <div className={styles.serviceCard}>
              <span className={styles.icon}>🚗</span>
              <h3>정비소 검색 및 예약</h3>
              <p>내 주변 정비소를 빠르게 찾고 온라인으로 예약하세요.</p>
            </div>

            <div className={styles.serviceCard}>
              <span className={styles.icon}>📊</span>
              <h3>실시간 견적 비교</h3>
              <p>정비소별 견적을 비교하여 가장 합리적인 가격을 선택하세요.</p>
            </div>

            <div className={styles.serviceCard}>
              <span className={styles.icon}>🛠️</span>
              <h3>차량 유지보수 기록 관리</h3>
              <p>정비 및 유지보수 이력을 한눈에 확인하고 관리하세요.</p>
            </div>
          </div>
        </section>


        {/* 자동차 수리 전문가 섹션 */}
        <section className={styles.mechanicsSection}>
          <h2>차고지의 자동차 수리 전문가</h2>
          <div className={styles.cardContainer}>
            {mechanics.map((mechanic, index) => (
              <div key={index} className={styles.card}>
                <img src={mechanic.image} alt={mechanic.name} className={styles.image} />
                <h3>{mechanic.name}</h3>
                <p className={styles.role}>{mechanic.role}</p> {/* 직책 추가 */}
                <p className={styles.specialty}>{mechanic.specialty}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
