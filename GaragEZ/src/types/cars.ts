export interface Cars {
  id: number;
  car_Model: string;
  image_Url: string;
  car_Make: string;
}

export const fetchCars = async (car_Make: string): Promise<Cars[]> => {
  const response = await fetch(`http://localhost:8080/api/parts?category=${car_Make}`);
  if (!response.ok) {
    throw new Error("Failed to fetch parts");
  }
  return response.json();
};