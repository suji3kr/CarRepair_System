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
import { Reservation } from "../types/reservation";

const ReservationPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  
  // 예약 목록을 가져오는 함수
  const fetchReservations = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        throw new Error("사용자 정보 또는 토큰이 없습니다.");
      }

      const response = await fetch(`http://localhost:8094/api/reservations/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("예약을 불러오는데 실패했습니다.");
      }

       // ✅ 데이터 유효성 검사 후 상태 업데이트
      if (Array.isArray(data)) {
        setReservations(data);
      } else {
        throw new Error("잘못된 데이터 형식입니다.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("예약을 불러오는 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    handleReservation();
  }, []);
  // 차량 정보가 없는 경우 자동으로 차량 추가 후 예약 진행
  const handleReservation = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        throw new Error("사용자 정보 또는 토큰이 없습니다.");
      }

      // 1. 차량 정보 확인
      const carResponse = await fetch(`http://localhost:8094/api/cars/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      let carId;
      if (!carResponse.ok) {
        // 2. 차량 정보가 없으면 기본 차량 추가
        const newCarResponse = await fetch("http://localhost:8094/api/cars", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userId,
            carMake: "기본 제조사",  // 기본값 설정
            carModel: "기본 모델",  // 기본값 설정
          }),
        });

        if (!newCarResponse.ok) {
          throw new Error("차량 정보 등록 실패");
        }

        const newCarData = await newCarResponse.json();
        carId = newCarData.id;  // 새로 등록된 차량 ID
      } else {
        const carData = await carResponse.json();
        carId = carData.id;
      }

      // 3. 예약 요청
      const reservationResponse = await fetch("http://localhost:8094/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          carId: carId,
          repairStoreId: 1, // 기본 정비소 ID (임시 값)
          appointmentId: `APT-${new Date().getTime()}`, // 사람이 읽기 쉬운 예약 ID
          appointmentsId: 1, // 기본 appointments ID (임시 값)
          appointmentDate: new Date().toISOString(), // 현재 날짜 기준 예약
          details: "자동 등록된 예약",
        }),
      });

      if (!reservationResponse.ok) {
        throw new Error("예약 등록 실패");
      }

      alert("자동으로 차량이 등록되었으며, 예약이 완료되었습니다.");
      fetchReservations(); // 예약 목록 업데이트
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("예약 처리 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  // 예약 취소 처리 함수
  const handleCancel = async (reservationId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      const response = await fetch(`http://localhost:8094/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("예약 취소에 실패했습니다.");
      }

      alert("예약이 취소되었습니다.");
      await fetchReservations(); // ✅ 예약 목록 업데이트

    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("예약 취소 중 알 수 없는 오류가 발생했습니다.");
      }
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
                  <TableCell>{reservation.appointmentId}</TableCell>
                  <TableCell>{reservation.repairStoreId}</TableCell>
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
              {reservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
