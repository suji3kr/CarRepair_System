// src/routes/AdminRoutes.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import UserManagement from "../pages/admin/UserManagement";
import CarManagement from "../pages/admin/CarManagement";
import ReservationManagement from "../pages/admin/ReservationManagement";
import PartShopManagement from "../pages/admin/PartShopManagement";


const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="users" element={<UserManagement />} />
        <Route path="cars" element={<CarManagement />} />
        <Route path="reservations" element={<ReservationManagement />} />
        <Route path="partshop" element={<PartShopManagement />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
