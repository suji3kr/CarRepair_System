import { Vehicle } from "./vehicle";

// ✅ 사용자 정보 타입
export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  vehicle?: Vehicle; // 차량 정보 포함
}

export interface UserWithVehicles {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  vehicles: Vehicle[];
  
}

export interface User {
  id: number; // UserResponseDto의 userId에 매핑
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string; // "USER" | "ADMIN"으로 제한 가능
  vehicles: Vehicle[]; // 차량 리스트
}