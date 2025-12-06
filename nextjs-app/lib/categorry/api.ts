import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const categoryApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface CategoryResponseDto {
  id: number;
  name: string;
  description: string;
}

export const categoryApi = {
  getAllCategories: async (): Promise<CategoryResponseDto[]> => {
    const response = await categoryApiClient.get("/api/categories");
    return response.data;
  },
};