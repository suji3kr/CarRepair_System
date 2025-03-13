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
