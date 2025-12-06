import { apiClient } from "../lib/api-client";

export async function fetchCandidates() {
  try {
    const response = await apiClient.get("/api/candidates");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch candidates:", error);
    throw error;
  }
}

export async function fetchCandidateById(id: number | string) {
  const res = await fetch(`http://localhost:8080/api/candidates/${id}`);
  if (!res.ok) {
    throw new Error("Không tìm thấy ứng viên với ID: " + id);
  }
  return res.json();
}
