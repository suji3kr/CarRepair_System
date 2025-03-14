// src/services/userService.ts
import axios from "axios";
import { UserWithVehicles } from "../types/user";


const API_URL = "http://localhost:8094/api/users/me";
const UPDATE_API_URL = "http://localhost:8094/api/users/update"; // 수정용 API 엔드포인트

// ✅ 사용자 정보 가져오기
export const fetchUserProfile = async (token: string): Promise<UserWithVehicles> => {
  try {
    const response = await axios.get<UserWithVehicles>(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("🚨 사용자 정보를 불러오는 중 오류 발생:", error);
    throw error;
  }
};

// ✅ 사용자 정보 업데이트 (수정 기능 추가)
export const updateUserProfile = async (user: UserWithVehicles): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("로그인이 필요합니다.");

    await axios.put(UPDATE_API_URL, user, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    console.log("✅ 사용자 정보 업데이트 완료");
  } catch (error) {
    console.error("🚨 사용자 정보 업데이트 실패:", error);
    throw error;
  }
};
