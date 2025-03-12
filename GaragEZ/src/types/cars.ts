export interface Cars {
  id: number;
  name: string;
  image_Url: string;
  category: string;
}

export const fetchCars = async (category: string): Promise<Cars[]> => {
  const response = await fetch(`http://localhost:8080/api/parts?category=${category}`);
  if (!response.ok) {
    throw new Error("Failed to fetch parts");
  }
  return response.json();
};