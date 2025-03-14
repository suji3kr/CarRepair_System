// Spring Boot로 보낼 회원가입 데이터 타입 정의
export interface FormData {
  // 사용자 정보
  userId: string;
  password: string;
  name: string;
  email: string;
  phone: string;

  // 차량 정보
  carId: string;
  carMake: string;
  carModel: string;
  carNumber: string;
  year: number | "";
  vin: string;

  // 공동 소유자 정보
  coOwner: boolean;
  coOwnerName: string;
  coOwnerPhone: string;

  // 이용 약관 동의
  termsAgreed: boolean;
}

// ✅ 회원가입 폼의 초기 상태값
export const initialFormData: FormData = {
  userId: "",
  password: "",
  name: "",
  email: "",
  phone: "",
  carId: "",
  carMake: "",
  carModel: "",
  carNumber: "",
  year: "",
  vin: "",
  coOwner: false,
  coOwnerName: "",
  coOwnerPhone: "",
  termsAgreed: false,
};
