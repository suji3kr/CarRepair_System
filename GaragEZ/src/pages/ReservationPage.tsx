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

interface Store {
  id: number;
  name: string;
  address: string;
}

interface Reservation {
  id: number;
  store: Store;
  reservationTime: string;
  details: string;
  status: string; // 예: PENDING, CONFIRMED, CANCELLED 등
}

const ReservationPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token"); // JWT 토큰을 localStorage에서 가져옵니다.
  
      if (!userId || !token) {
        throw new Error("사용자 정보 또는 토큰이 없습니다.");
      }
  
      const response = await fetch(`http://localhost:8094/api/reservations/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함시킴
        },
      });
  
      if (!response.ok) {
        throw new Error("예약을 불러오는데 실패했습니다.");
      }
  
      const data = await response.json();
      setReservations(data);
    } catch (err: any) {
      setError(err.message || "예약을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (reservationId: number) => {
    try {
      const response = await fetch(`http://localhost:8094/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("예약 취소에 실패했습니다.");
      }
      alert("예약이 취소되었습니다.");
      fetchReservations();
    } catch (err: any) {
      alert(err.message || "예약 취소 중 오류가 발생했습니다.");
    }
  };

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
                <TableCell>가게 이름</TableCell>
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
              {reservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    예약 내역이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
};

export default ReservationPage;
