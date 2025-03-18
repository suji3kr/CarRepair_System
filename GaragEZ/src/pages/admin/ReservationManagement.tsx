// src/pages/admin/ReservationManagement.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setReservations(res.data))
      .catch((error) => console.error("Error fetching reservations:", error));
  }, []);

  return (
    <div>
      <h2>예약 관리</h2>
      <ul>
        {reservations.map((res) => (
          <li key={res.id}>
            {res.user_id} - {res.reservation_time} - {res.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationManagement;
