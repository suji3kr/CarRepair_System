import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 예약 정보 인터페이스 (이미 선언되어 있다면 생략)
interface Reservation {
  id: number;
  repairStoreId: number;
  userId: string;
  carId: number;
  reservationTime: string; // "2025-03-20T10:00:00"
  details: string;
  status: string;          // "PENDING" | "CONFIRMED" | "CANCELLED"
  createdAt: string;       // "2025-03-01T09:30:00"
}

const MyReservationsPage: React.FC = () => {
  const navigate = useNavigate();

  // 1) 로그인 시 localStorage 등에 저장해둔 userId 가져오기
  //    실제로는 JWT 토큰 등에서 파싱해 오는 경우도 많음.
  const [userId, setUserId] = useState<string>("");

  // 2) 예약 목록, 로딩 상태, 에러 상태
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 3) 컴포넌트가 마운트되면 localStorage에서 userId를 가져옴
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId"); // 예: 로그인 시 저장해둔 값
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // userId가 없으면 로그인 페이지로 보낼 수도 있음
      navigate("/login");
    }
  }, [navigate]);

  // 4) userId가 설정되면, 해당 userId의 예약 목록을 조회
  useEffect(() => {
    if (!userId) return; // userId가 없으면 요청하지 않음

    const fetchReservations = async () => {
      try {
        // 실제 백엔드 포트/경로에 맞춰 수정
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 인증이 필요하다면, 토큰을 가져와서 Authorization 헤더 추가
            // "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }
        const data: Reservation[] = await response.json();
        setReservations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  // 5) 인라인 스타일 (실제 프로젝트에서는 CSS 모듈/Styled-Components 사용 권장)
  const containerStyle: React.CSSProperties = {
    maxWidth: "800px",
    margin: "4rem auto", // 헤더와 충분한 간격을 주기 위해 top에 4rem
    padding: "1rem",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  };

  const titleStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: 600,
    textAlign: "center",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thTdStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "12px",
    textAlign: "center",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  };

  // 6) 로딩/에러/정상 UI
  if (loading) {
    return <div style={{ marginTop: "100px", textAlign: "center" }}>로딩 중...</div>;
  }
  if (error) {
    return <div style={{ marginTop: "100px", textAlign: "center" }}>에러 발생: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>{userId}님의 예약 목록</h1>
      {reservations.length === 0 ? (
        <p style={{ textAlign: "center" }}>예약 내역이 없습니다.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>예약 ID</th>
              <th style={thTdStyle}>정비소 ID</th>
              <th style={thTdStyle}>차량 ID</th>
              <th style={thTdStyle}>예약 시간</th>
              <th style={thTdStyle}>상태</th>
              <th style={thTdStyle}>생성 일시</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td style={thTdStyle}>{res.id}</td>
                <td style={thTdStyle}>{res.repairStoreId}</td>
                <td style={thTdStyle}>{res.carId}</td>
                <td style={thTdStyle}>{res.reservationTime}</td>
                <td style={thTdStyle}>{res.status}</td>
                <td style={thTdStyle}>{res.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button style={buttonStyle} onClick={() => navigate("/contact")}>
        새 예약하기
      </button>
    </div>
  );
};

export default MyReservationsPage;
