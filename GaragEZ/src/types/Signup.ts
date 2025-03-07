// Spring Boot로 보낼 회원가입 데이터 타입 정의
export interface FormData {
  // 사용자
  user_id: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  // 차량
  carMake: string;
  carModel: string;
  carNumber: string;
  year: number;
  vin: string;
  //공동소유자
  coOwner: boolean;
  coOwnerName: string;
  coOwnerPhone: string;
  
  termsAgreed: boolean;
}
