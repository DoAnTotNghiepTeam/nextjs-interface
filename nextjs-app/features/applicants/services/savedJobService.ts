import { apiClient } from "@/lib/api-client";


export const savedJobService = {
  saveJob: (jobPostingId: number) =>
    apiClient.post(`/api/saved-jobs/${jobPostingId}`),

  // getMySavedJobs: () =>
  //   apiClient.get(`/api/saved-jobs`),

getMySavedJobs: ({
  page = 0,
  size = 10,
  sortBy = "savedAt",
  sortDir = "desc",
}: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
} = {}) =>   // 👈 thêm dấu = {} ở đây
  apiClient.get(`/api/saved-jobs`, {
    params: { page, size, sortBy, sortDir },
  }),


  removeSavedJob: (id: number) =>
    apiClient.delete(`/api/saved-jobs/${id}`),
};
