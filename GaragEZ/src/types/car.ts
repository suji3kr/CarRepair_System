// src/types/Car.ts
export interface Car {
  id: number; // ✅ Snake_Case → camelCase로 변경
  carModel: string;
  imageUrl: string;
  carMake: string;
  year: number; // ✅ 백엔드에 존재하는 필드 추가
  carNumber: string; // ✅ 추가된 필드
}
