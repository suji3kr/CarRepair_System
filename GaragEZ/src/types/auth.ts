// 로그인 요청 타입
export interface LoginRequest {
  userId: string;  // ✅ email 대신 userId 사용
  password: string;
}

// Google 로그인 요청 타입
export interface GoogleLoginRequest {
  tokenId: string;
}

// JWT 응답 타입
export interface JwtResponse {
  token: string;
  newUser: boolean; // 새로운 사용자 여부 (true/false)
  userId: number;   // 사용자 ID
  userRole?: string;  // ✅ userRole 추가 (선택적 속성으로 설정)
}
