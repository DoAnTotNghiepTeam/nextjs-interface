import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const aboutUsApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface AboutUsResponse {
  id: number;
  companyName: string;
  companyTitle: string;
  companyDescription: string;
  servicesSectionTitle: string;
  servicesSectionDescription: string;
  imageUrl: string;
}

export const aboutUsApi = {
  getAboutUs: async (): Promise<AboutUsResponse[]> => {
    const response = await aboutUsApiClient.get("/api/aboutus");
    return response.data;
  },
};
