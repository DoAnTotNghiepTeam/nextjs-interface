import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const ourTeamApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface OurTeamResponseDto {
  id: number;
  ourTeam: string;
  ourTeamTitle: string;
  ourTeamDescription: string;
  name: string;
  viTri: string;
  location: string;
  imageUrl: string;
}

export const ourTeamApi = {
  getAllOurTeam: async (): Promise<OurTeamResponseDto[]> => {
    const response = await ourTeamApiClient.get("/api/ourteam");
    return response.data;
  },
};
