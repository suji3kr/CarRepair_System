// src/types/Reservation.ts
export interface Reservation {
  id: number;
  repairStoreId: number;
  userId: string;
  carId: number;
  reservationTime: string; // "2025-03-20T10:00:00" 등
  details: string;
  status: string;          // "PENDING" | "CONFIRMED" | "CANCELLED"
  createdAt: string;       // "2025-03-01T09:30:00"
}
