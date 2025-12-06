// response chung
export interface ApiResponse<T> {
status: "success" | "error";   // "success" | "error"
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
