// 정비소 타입
export interface Store {
  id: number;
  name: string;
  address: string;
}

// 정비소 정보 타입 (SQL의 `repair_store` 테이블과 일치)
export interface RepairStore {
  id: number;   // repair_store의 고유 ID
  storeId: number; // store 테이블의 ID (store.id 참조)
  appointmentId: number | null; // appointments 테이블과 연결됨 (nullable)
  location: string;
  contactInfo: string;
  createdAt: string; // TIMESTAMP
}

// 정비 예약(appointments) 정보 타입
export interface Appointment {
  id: number; // appointments의 기본 키 (auto_increment)
  userId: number; // users 테이블과 연결
  vehicleId: number; // vehicles 테이블과 연결
  serviceType: string;
  status: "예약" | "진행중" | "완료";
  appointmentDate: string; // TIMESTAMP (예약 날짜)
  createdAt: string;
}

// 예약 정보 타입 (SQL의 `reservations` 테이블과 일치)
export interface Reservation {
  id: number; // 기본 키 (PK)
  appointmentId: string; // 사람이 읽기 쉬운 예약 ID (VARCHAR 20)
  appointmentsId: number; // appointments 테이블과 연결됨
  repairStoreId: number; // repair_store 테이블과 연결됨
  userId: string; // users 테이블과 연결
  carId: number; // car 테이블과 연결
  reservationTime: string; // DATETIME (예약 시간)
  details: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED"; // ENUM 값
  createdAt: string; // TIMESTAMP
}

// ContactForm에서 사용하는 예약 요청 타입
export interface ReservationRequest {
  userId: string; // users 테이블 참조
  appointmentId: string; // 사람이 읽기 쉬운 예약 ID (VARCHAR 20)
  appointmentsId: number; // appointments 테이블 참조
  repairStoreId: number; // repair_store 테이블 참조
  carId: number; // car 테이블 참조
  appointmentDate: string; // YYYY-MM-DD 형식
  details: string;
}