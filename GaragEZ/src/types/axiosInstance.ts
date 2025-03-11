import axios from "axios";

// 기본 axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: "http://localhost:8094/api", // 백엔드 API 주소
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // 쿠키 인증이 필요한 경우 설정
});

// 요청 시 JWT 토큰 자동 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 에러 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            alert("인증이 만료되었습니다. 다시 로그인해주세요.");
            localStorage.removeItem("token");
            window.location.href = "/login"; // 로그인 페이지로 이동
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
