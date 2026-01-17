export interface ErrorApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

export interface ApiResponse<T> extends ErrorApiResponse {
  success: boolean;
  message: string;
  data?: T;
}
