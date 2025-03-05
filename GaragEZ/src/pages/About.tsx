import { useEffect } from "react";
import styles from "../styles/About.module.css";
import Layout from "../components/Layout"; // Layout 컴포넌트 적용

export default function About() {
  useEffect(() => {
    console.log("About 페이지 로드됨");
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1>차고지, 차량 유지보수의 모든 것</h1>
          <p>전문가와 함께하는 쉽고 편리한 자동차 관리 서비스</p>
        </section>

        <section className={styles.aboutUs}>
          <h2>차고지, 자동차 유지보수의 혁신을 이끕니다</h2>
          <p>우리는 차량 유지보수 시장을 보다 투명하고 효율적으로 만들기 위해 시작되었습니다.</p>
        </section>

        <section className={styles.services}>
          <h2>차고지가 제공하는 서비스</h2>
          <ul>
            <li>🚗 정비소 검색 및 예약</li>
            <li>📊 실시간 견적 비교</li>
            <li>🛠️ 차량 유지보수 기록 관리</li>
            <li>🔧 출장 정비 서비스</li>
          </ul>
        </section>

        <section className={styles.contact}>
          <h2>문의하기</h2>
          <p>📍 서울시 강남구 테헤란로 123, 10층</p>
          <p>📧 support@chagoji.com</p>
          <p>📞 02-1234-5678</p>
        </section>
      </div>
    </Layout>
  );
}
