import axios, { type AxiosResponse } from "axios";
import type { ApiResponse, ErrorApiResponse } from "../types/api.type";
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  withCredentials: true,
  timeout: 40000,
});

instance.interceptors.request.use(
  function (config) {
    // if (config.data instanceof FormData) {
    //   config.headers["Content-Type"] = "multipart/form-data";
    // } else {
    //   config.headers["Content-Type"] = "application/json";
    // }
    // Do something before request is sent

    const token = sessionStorage.getItem("access_token");
    config.headers.Authorization = token ? `Bearer ${token}` : "";

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function <T>(response: AxiosResponse): AxiosResponse<ApiResponse<T>> {
    response.data = {
      message: response.data.message,
      statusCode: response.status,
      success: response.data.success,
      data: response.data as T,
    };
    return response.data;
  },
  function (error): Promise<unknown> {
    const customError: ErrorApiResponse = {
      ...error.response?.data,
      message: error.response?.data?.message || error.message,
      success: error.response?.data?.success,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  },
);
export default instance;
