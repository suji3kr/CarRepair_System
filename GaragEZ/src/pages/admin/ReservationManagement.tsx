// src/pages/admin/ReservationManagement.tsx
import React, { useEffect, useState } from "react";

const ReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/reservations`)
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch((error) => console.error("Error fetching reservations:", error));
  }, []);

  return (
    <div>
      <h2>예약 관리</h2>
      <ul>
        {reservations.map((res, index) => (
          <li key={index}>{res.customer} - {res.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationManagement;
