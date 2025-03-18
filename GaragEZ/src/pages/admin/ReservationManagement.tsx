import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동을 위한 navigate 추가
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from "@mui/material";

interface Reservation {
  id: number;
  user_id: number;
  reservation_time: string;
  status: string;
}

const ReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 useNavigate()

  useEffect(() => {
    (async () => {
      await checkAdmin();
      fetchReservations();
    })();
  }, []);

  // ✅ 관리자 체크 기능 추가
  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error();
      }
    } catch (error: unknown) {
      console.error("🚨 관리자 접근 오류 발생:", error);
    
      let errorMessage = "🚫 관리자만 접근할 수 있습니다."; // 기본 메시지
    
      // TypeScript에서 안전하게 에러 메시지 가져오기
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
    
      // ✅ Axios 에러 처리 (응답 데이터가 객체일 경우 JSON.stringify 활용)
      if (axios.isAxiosError(error) && error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else {
          errorMessage = `⚠ 오류: 관리자가 아닙니다. 접근 불가능합니다.`;
        }
      }

      alert(`⛔ ${errorMessage}`);
      navigate("/home");
    }
  };

  const fetchReservations = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get<Reservation[]>(`${import.meta.env.VITE_API_URL}/api/admin/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <p>페이지 구현 중입니다. 빠른 시일 내 만나요~ 🚀</p>
      </div>
    );
  }

  return (
    <div>
      <h2>예약 관리</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>예약 ID</TableCell>
              <TableCell>사용자 ID</TableCell>
              <TableCell>예약 시간</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((res) => (
              <TableRow key={res.id}>
                <TableCell>{res.id}</TableCell>
                <TableCell>{res.user_id}</TableCell>
                <TableCell>{new Date(res.reservation_time).toLocaleString()}</TableCell>
                <TableCell>{res.status}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" size="small">수정</Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => alert(`예약 ID ${res.id} 삭제 예정`)}
                    style={{ marginLeft: "5px" }}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ReservationManagement;
