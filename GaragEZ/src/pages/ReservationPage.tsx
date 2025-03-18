import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// 예약 정보 인터페이스
interface Reservation {
  id: number;
  store: {
    name: string;
  };
  carId: number;
  reservationTime: string;
  details: string;
  status: string;
}

const ReservationPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      store: {
        name: "차고지 서울점",
      },
      carId: 123,
      reservationTime: "2025-03-18T10:00:00Z",
      details: "엔진오일 교체",
      status: "완료",
    },
    {
      id: 2,
      store: {
        name: "차고지 용인중앙지점",
      },
      carId: 123,
      reservationTime: "2025-03-20T14:00:00Z",
      details: "차량 점검 예약",
      status: "대기중",
    },
  ]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // 예약 목록을 가져오는 함수
  const fetchReservations = async () => {
    try {
      const userId = localStorage.getItem("userId"); // 사용자 ID
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        throw new Error("");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("예약을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      setReservations(data);
    } catch (err: any) {
      setError(err.message || "");
    }
  };

  // 예약 취소 처리 함수
  const handleCancel = async (reservationId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("예약 취소에 실패했습니다.");
      }

      alert("예약이 취소되었습니다.");
      fetchReservations(); // 예약 목록 다시 불러오기
    } catch (err: any) {
      alert(err.message || "예약 취소 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchReservations(); // 컴포넌트가 마운트될 때 예약 목록 불러오기
  }, []);

  return (
    <Layout>
      <Container maxWidth="md" style={{ marginTop: "80px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          내 예약 내역
        </Typography>
        {error && (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>예약 ID</TableCell>
                <TableCell>정비소</TableCell>
                <TableCell>차량 ID</TableCell>
                <TableCell>예약 날짜</TableCell>
                <TableCell>세부사항</TableCell>
                <TableCell>상태</TableCell>
                <TableCell align="center">취소</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.id}</TableCell>
                  <TableCell>{reservation.store.name}</TableCell>
                  <TableCell>{reservation.carId}</TableCell>
                  <TableCell>
                    {new Date(reservation.reservationTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{reservation.details}</TableCell>
                  <TableCell>{reservation.status}</TableCell>
                  <TableCell align="center">
                    {(reservation.status === "PENDING" ||
                      reservation.status === "CONFIRMED") && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleCancel(reservation.id)}
                      >
                        취소
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
};

export default ReservationPage;
