// src/components/VehicleList.tsx
import React, { useState } from "react";
import styles from "../styles/Profile.module.css";
import { Vehicle } from "../types/vehicle";


interface VehicleListProps {
  vehicles: Vehicle[];
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles }) => {
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0); // 선택된 차량 인덱스 상태

  if (!vehicles || vehicles.length === 0) {
    return <p className={styles.noVehicles}>등록된 차량이 없습니다.</p>;
  }

  const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicleIndex(Number(event.target.value));
  };

  const selectedVehicle = vehicles[selectedVehicleIndex]; // 선택된 차량 데이터

  return (
    <div className={styles.vehicleContainer}>
      <h3 className={styles.vehicleTitle}>등록된 차량 정보</h3>
      
      {/* 차량 선택 드롭다운 */}
      <div className={styles.vehicleSelect}>
        <label>차량 선택</label>
        <select value={selectedVehicleIndex} onChange={handleVehicleChange}>
          {vehicles.map((vehicle, index) => (
            <option key={vehicle.id} value={index}>
              {`${vehicle.carMake} ${vehicle.carModel} (${vehicle.carNumber})`}
            </option>
          ))}
        </select>
      </div>

      {/* 선택된 차량 정보 */}
      <div className={styles.profileSection}>
        <label>제조사</label>
        <input type="text" value={selectedVehicle.carMake} readOnly />
        
        <label>모델</label>
        <input type="text" value={selectedVehicle.carModel} readOnly />
        
        <label>차량 번호</label>
        <input type="text" value={selectedVehicle.carNumber} readOnly />
        
        <label>제조 연도</label>
        <input type="text" value={selectedVehicle.year} readOnly />
        
        <label>VIN (차대번호)</label>
        <input type="text" value={selectedVehicle.vin} readOnly />
        
        <label>공동 소유 여부</label>
        <input type="text" value={selectedVehicle.coOwner ? "예" : "아니오"} readOnly />
        
        <label>공동 소유자 이름</label>
        <input type="text" value={selectedVehicle.coOwnerName || "없음"} readOnly />
        
        <label>공동 소유자 전화번호</label>
        <input type="text" value={selectedVehicle.coOwnerPhone || "없음"} readOnly />
        
        <label>등록일</label>
        <input type="text" value={new Date(selectedVehicle.createdAt).toLocaleDateString()} readOnly />
      </div>
    </div>
  );
};

export default VehicleList;