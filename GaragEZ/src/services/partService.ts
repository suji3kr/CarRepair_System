import axios from "axios";

const API_BASE_URL = "http://localhost:8094/api/parts";

// ✅ 모든 부품 가져오기
export const fetchParts = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("❌ [fetchParts] API 요청 오류:", error);
    return [];
  }
};

// ✅ 특정 부품 가져오기
export const fetchPartById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ [fetchPartById] ID=${id} 요청 오류:`, error);
    return null;
  }
};

// ✅ 부품 추가 (Create)
export const createPart = async (part: { name: string; category: string; price: number; stock: number }) => {
  try {
    const response = await axios.post(API_BASE_URL, part);
    return response.data;
  } catch (error) {
    console.error("❌ [createPart] API 요청 오류:", error);
    return null;
  }
};

// ✅ 부품 수정 (Update)
export const updatePart = async (id: number, part: { name: string; category: string; price: number; stock: number }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, part);
    return response.data;
  } catch (error) {
    console.error(`❌ [updatePart] ID=${id} 수정 오류:`, error);
    return null;
  }
};

// ✅ 부품 삭제 (Delete)
export const deletePart = async (id: number) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`❌ [deletePart] ID=${id} 삭제 오류:`, error);
    return false;
  }
};
