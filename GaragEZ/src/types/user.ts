// ✅ 사용자 정보 타입
export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  vehicle?: Vehicle; // 차량 정보 포함
}

// ✅ 차량 정보 타입 (VehicleDto 기반)
export interface Vehicle {
  owner_id: string;
  car_id: string;
  carMake: string;
  carModel: string;
  year: number;
  vin: string;
  carNumber: string;
  coOwner: boolean; // 공동 소유 여부
  coOwnerName?: string; // 공동 소유주 이름 (optional)
  coOwnerPhone?: string; // 공동 소유주 연락처 (optional)
}
