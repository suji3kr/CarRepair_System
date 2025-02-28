import axios from "axios";

const API_BASE_URL = "http://localhost:8094/api/parts";

export const fetchParts = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const fetchPartById = async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createPart = async (part: { name: string; category: string; price: number; stock: number }) => {
    const response = await axios.post(API_BASE_URL, part);
    return response.data;
};

export const updatePart = async (id: number, part: { name: string; category: string; price: number; stock: number }) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, part);
    return response.data;
};

export const deletePart = async (id: number) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};
