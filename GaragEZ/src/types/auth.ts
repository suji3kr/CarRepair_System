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
}
