// 로그인 요청 타입
export interface LoginRequest {
  email: string;
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
