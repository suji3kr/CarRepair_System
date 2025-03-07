// Spring Boot로 보낼 회원가입 데이터 타입 정의
export interface FormData {
  user_id: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  carModel: string;
  carNumber: string;
  coOwner: boolean;
  coOwnerName: string;
  coOwnerPhone: string;
  termsAgreed: boolean;
}
