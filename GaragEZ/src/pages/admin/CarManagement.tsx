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
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const fetchCars = async () => {
      try {
        // ✅ 응답 타입 명확하게 지정 (Car[])
        const response = await axios.get<Car[]>("http://localhost:8094/api/admin/cars", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        // ✅ `car: any` → `car: Car` 로 변경하여 타입 명확화
        const formattedCars: Car[] = response.data.map((car: Car) => ({
          id: car.id, // ✅ car_id → id (이미 Car 인터페이스에 맞게 정의됨)
          carModel: car.carModel,
          imageUrl: car.imageUrl,
          carMake: car.carMake,
          year: car.year,
          carNumber: car.carNumber,
        }));

        setCars(formattedCars);
      } catch (err) {
        console.error("🚨 차량 데이터 불러오기 실패:", err);
        setError("차량 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchCars();
  }, [navigate]);

  // ✅ 차량 삭제 함수
  const handleDelete = async (carId: number) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("이 차량을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/cars/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      <h2>🚗전체 차량 관리</h2>
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
