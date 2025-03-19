import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

    const fetchReservations = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
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

  const containerStyle: React.CSSProperties = {
    maxWidth: "800px",
    margin: "4rem auto",
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