/* eslint-disable */
import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const blogApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface BlogResponseDto {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageUrl: string;
  category: Category;
  createdAt: string;
  updatedAt: string; // LocalDateTime sẽ được serialize thành string
}

export function mapApiToBlogForm(
  apiData: BlogResponseDto & { id?: number }
): any {
  return {
    id: apiData.id,
    title: apiData.title,
    slug: apiData.slug,
    content: apiData.content,
    summary: apiData.summary,
    imageUrl: apiData.imageUrl,
    categoryId: apiData.category.id,
    categoryName: apiData.category.name,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };
}

export const blogApi = {
  // Lấy tất cả blogs
  getAllBlogs: async (): Promise<BlogResponseDto[]> => {
    const response = await blogApiClient.get("/api/blogs", {});
    return response.data;
  },

  // Lấy blog theo ID
  getBlogById: async (id: number | string): Promise<BlogResponseDto> => {
    const response = await blogApiClient.get(`/api/blogs/${id}`);
    return response.data;
  },

  // Lấy blogs theo category
  getBlogsByCategory: async (
    categoryId: number
  ): Promise<BlogResponseDto[]> => {
    const response = await blogApiClient.get(
      `/api/blogs/category/${categoryId}`
    );
    return response.data;
  },

  // Lấy blog theo slug
  getBlogBySlug: async (slug: string): Promise<BlogResponseDto> => {
    const response = await blogApiClient.get(`/api/blogs/slug/${slug}`);
    return response.data;
  },

  // Tìm kiếm blogs
  searchBlogs: async (query: string): Promise<BlogResponseDto[]> => {
    const response = await blogApiClient.get(
      `/api/blogs/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },
};
