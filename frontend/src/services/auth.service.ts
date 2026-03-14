import axios from "../configs/axios.config";
import type { ApiResponse } from "../types/api.type";
import type { loginReqest } from "../types/auth/request";
import type { UserResponse } from "../types/user/response";

export const loginService = async (
  data: loginReqest,
): Promise<ApiResponse<UserResponse>> => {
  const URL_API = "/auth/login";
  const res = await axios.post(URL_API, data);
  return res.data;
};

export const logoutService = async (): Promise<ApiResponse<null>> => {
  const URL_API = "/auth/logout";
  const res = await axios.post(URL_API);
  return res.data;
};