import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer"; // Footer 컴포넌트 추가

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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Failed to fetch reservations: ${errorData.message || response.statusText} (Status: ${response.status})`);
        }
        const data: Reservation[] = await response.json();
        console.log("Fetched reservations:", data);
        setReservations(data);
      } catch (err: any) {
        setError(err.message);
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
    const store = repairStores.find(store => store.id === repairStoreId);
    return store ? store.name : `알 수 없는 정비소 (${repairStoreId})`;
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "800px",
    margin: "4rem auto",
    padding: "1rem",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  };

  const thTdStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "12px",
    textAlign: "center",
  };

  // carId를 위한 숨김 스타일
  const hiddenStyle: React.CSSProperties = {
    ...thTdStyle,
    display: "none",
  };

  if (loading) {
    return <div style={{ marginTop: "100px", textAlign: "center" }}>로딩 중...</div>;
  }
  if (error) {
    return <div style={{ marginTop: "100px", textAlign: "center" }}>에러 발생: {error}</div>;
  }

  return (
    <>
      <div style={containerStyle}>
        <h1 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: 600, textAlign: "center" }}>
          {userId}님의 예약 목록
        </h1>
        {reservations.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
            아직 예약 내역이 없습니다. 새 예약을 시작해보세요!
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thTdStyle}>예약 ID</th>
                <th style={thTdStyle}>정비소</th>
                <th style={hiddenStyle}>차량</th> {/* carId 숨김 */}
                <th style={thTdStyle}>예약 시간</th>
                <th style={thTdStyle}>상태</th>
                <th style={thTdStyle}>생성 일시</th>
                <th style={thTdStyle}>상세 내용</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td style={thTdStyle}>{res.id}</td>
                  <td style={thTdStyle}>{getRepairStoreName(res.repairStoreId)}</td>
                  <td style={hiddenStyle}>{res.carId}</td> {/* carId 숨김 */}
                  <td style={thTdStyle}>{formatDate(res.reservationTime)}</td>
                  <td style={thTdStyle}>{res.status}</td>
                  <td style={thTdStyle}>{formatDate(res.createdAt)}</td>
                  <td style={thTdStyle}>{res.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={() => navigate("/contact")}
        >
          새 예약하기
        </button>
      </div>
      {/* Footer 컴포넌트 렌더링 */}
      <Footer />
    </>
  );
};

export default MyReservationsPage;
