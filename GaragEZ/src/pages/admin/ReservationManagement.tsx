import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Reservation {
  id: number;
  userId: string;
  reservationTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  repairStoreId: number;
  carId: number;
  details?: string;
}

const ReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await checkAdmin();
      fetchReservations();
    })();
  }, []);

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("🔒 로그인 후 이용해주세요.");
      }

      await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("🚨 관리자 접근 오류 발생:", error);
      alert("⛔ 관리자 권한이 없습니다.");
      navigate("/home");
    }
  };

  const fetchReservations = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("🔒 인증이 필요합니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get<Reservation[]>(`${import.meta.env.VITE_API_URL}/api/admin/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      let errorMessage = "예약 목록을 불러오는 데 실패했습니다.";
      if (axios.isAxiosError(error) && error.response?.data) {
        errorMessage = typeof error.response.data === "string" ? error.response.data : "서버 오류가 발생했습니다.";
      }
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = useCallback(async (id: number, newStatus: "CONFIRMED" | "CANCELLED") => {
    if (updating !== null) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("🔒 인증이 필요합니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    setUpdating(id);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/reservations/${id}/status`,
        { status: newStatus }, // ✅ 객체 형태로 변경
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(res.data);
      fetchReservations();
    } catch (error) {
      console.error("Error updating reservation status:", error);
      let errorMessage = "상태 업데이트에 실패했습니다.";
      if (axios.isAxiosError(error) && error.response?.data) {
        errorMessage = typeof error.response.data === "string" ? error.response.data : "서버 오류가 발생했습니다.";
      }
      alert(`❌ ${errorMessage}`);
    } finally {
      setUpdating(null);
    }
  }, [updating]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>예약 관리</h2>
      {reservations.length === 0 ? (
        <p style={{ textAlign: "center", margin: "20px 0" }}>예약이 없습니다.</p>
      ) : (
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
                  <TableCell>{res.userId}</TableCell>
                  <TableCell>{format(new Date(res.reservationTime), "yyyy-MM-dd HH:mm:ss", { locale: ko })}</TableCell>
                  <TableCell>{res.status}</TableCell>
                  <TableCell>
                    {res.status === "PENDING" && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => updateReservationStatus(res.id, "CONFIRMED")}
                          disabled={updating === res.id}
                        >
                          승인
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => updateReservationStatus(res.id, "CANCELLED")}
                          disabled={updating === res.id}
                          style={{ marginLeft: "5px" }}
                        >
                          취소
                        </Button>
                      </>
                    )}
                    {res.status === "CONFIRMED" && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => updateReservationStatus(res.id, "CANCELLED")}
                        disabled={updating === res.id}
                      >
                        취소
                      </Button>
                    )}
                    {res.status === "CANCELLED" && <span>완료</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ReservationManagement;
