import axiosInstance from "./axiosInstance";

// 일반 로그인 요청
export const login = async (userId: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", { userId, password });
    return response.data;
};

// Google 로그인 요청
export const googleLogin = async (tokenId: string) => {
    const response = await axiosInstance.post("/auth/google-login", { tokenId });
    return response.data;
};
