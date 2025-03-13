// src/pages/admin/CarManagement.tsx
import React, { useEffect, useState } from "react";

const CarManagement: React.FC = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8094/api/admin/cars")
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((error) => console.error("Error fetching cars:", error));
  }, []);

  return (
    <div>
      <h2>차량 관리</h2>
      <ul>
        {cars.map((car, index) => (
          <li key={index}>{car.model} - {car.owner}</li>
        ))}
      </ul>
    </div>
  );
};

export default CarManagement;
