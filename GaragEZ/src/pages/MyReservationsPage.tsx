import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MyReservationsPage.module.css"; // CSS 모듈 추가
import Layout from "../components/Layout";

interface Reservation {
  id: number;
  repairStoreId: number;
  userId: string;
  carId: number;
  reservationTime: string;
  details: string;
  status: string;
  createdAt: string;
}

// 정비소 목록 정의
const repairStores = [
  { id: 1, lat: 37.2928, lng: 126.9910, name: "스타필드점" },
  { id: 2, lat: 37.2374, lng: 127.2052, name: "용인중앙지점" },
  { id: 3, lat: 37.5665, lng: 126.978, name: "서울" },
  { id: 4, lat: 35.1796, lng: 129.0756, name: "부산" },
  { id: 5, lat: 33.4996, lng: 126.5312, name: "제주" },
];

const MyReservationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("token");

    const fetchReservations = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/reservations/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!response.ok) {
          let errorMessage = `Failed to fetch reservations: ${response.statusText} (Status: ${response.status})`;

          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // JSON 파싱 실패 시 기본 메시지 사용
          }

          throw new Error(errorMessage);
        }

        const data: Reservation[] = await response.json();
        console.log("Fetched reservations:", data);
        setReservations(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 정비소 ID를 이름으로 변환하는 함수
  const getRepairStoreName = (repairStoreId: number) => {
    const store = repairStores.find((store) => store.id === repairStoreId);
    return store ? store.name : `알 수 없는 정비소 (${repairStoreId})`;
  };

  // 예약 상태를 한글로 변환하는 함수
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "예약 완료";
      case "CANCELLED":
        return "예약 취소";
      case "PENDING":
        return "예약 대기 중";
      default:
        return "알 수 없음";
    }
  };

  if (loading) {
    return <div style={{ marginTop: "100px", textAlign: "center" }}>로딩 중...</div>;
  }
  if (error) {
    return <div style={{ marginTop: "100px", textAlign: "center" }}>에러 발생: {error}</div>;
  }

  return (
    <>
      <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{userId}님의 예약 목록</h1>
        {reservations.length === 0 ? (
          <p className={styles.message}>아직 예약 내역이 없습니다. 새 예약을 시작해보세요!</p>
        ) : (
          <table className={styles.reservtable}>
            <thead>
              <tr>
                <th className={styles.thTd}>예약 ID</th>
                <th className={styles.thTd}>정비소</th>
                <th className={styles.hidden}>차량</th> {/* carId 숨김 */}
                <th className={styles.thTd}>예약 시간</th>
                <th className={styles.thTd}>상태</th>
                <th className={styles.thTd}>생성 일시</th>
                <th className={styles.thTd}>상세 내용</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td className={styles.thTd}>{res.id}</td>
                  <td className={styles.thTd}>{getRepairStoreName(res.repairStoreId)}</td>
                  <td className={styles.hidden}>{res.carId}</td> {/* carId 숨김 */}
                  <td className={styles.thTd}>{formatDate(res.reservationTime)}</td>
                  <td className={styles.thTd}>{getStatusLabel(res.status)}</td>
                  <td className={styles.thTd}>{formatDate(res.createdAt)}</td>
                  <td className={styles.thTd}>{res.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className={styles.button} onClick={() => navigate("/contact")}>
          새 예약하기
        </button>
      </div>
      </Layout>
    </>
  );
};

export default MyReservationsPage;
