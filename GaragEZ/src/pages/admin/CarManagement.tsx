import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Car } from "../../types/car";
import "../../styles/CarManagement.css"; // ✅ CSS 추가

const CarManagement: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await checkAdmin();
      fetchCars();
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
    
      if (axios.isAxiosError(error) && error.response?.data) {
        errorMessage = typeof error.response.data === "string" ? error.response.data : `⚠ 오류: 관리자가 아닙니다. 접근 불가능합니다.`;
      }

      alert(`⛔ ${errorMessage}`);
      navigate("/home");
    }
  };

  const fetchCars = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get<Car[]>(`${import.meta.env.VITE_API_URL}/api/admin/cars`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setCars(response.data);
    } catch (err) {
      console.error("🚨 차량 데이터 불러오기 실패:", err);
      setError("차량 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  // ✅ 차량 삭제 함수
  const handleDelete = async (carId: number) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("이 차량을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // ✅ 삭제 후 목록 갱신
      setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
    } catch (err) {
      console.error("🚨 차량 삭제 실패:", err);
      alert("차량 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="car-management">
      <h2>🚗 전체 차량 관리</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : cars.length === 0 ? (
        <p>등록된 차량이 없습니다.</p>
      ) : (
        <table className="car-table">
          <thead>
            <tr>
              <th>이미지</th>
              <th>제조사</th>
              <th>모델</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>
                  <img src={`/images/${car.imageUrl}`} alt={car.carModel} width="80" height="50" />
                </td>
                <td>{car.carMake}</td>
                <td>{car.carModel}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(car.id)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CarManagement;
