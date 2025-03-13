export interface Car {
  id: number;
  carModel: string;
  imageUrl: string;
  carMake: string;
}

export const fetchCars = async (car_Make: string): Promise<Car[]> => {
  const response = await fetch(`http://localhost:8094/api/parts?category=${car_Make}`);
  if (!response.ok) {
    throw new Error("Failed to fetch parts");
  }
  return response.json();
};