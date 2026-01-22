import { Response, Request } from "express";
import { createUser } from "../services/user.service";
import { AppError } from "../middleware/errorHandler";
import { CustomResponse } from "../config/response.custom";
import { handleLogin } from "../services/auth.service";
export const register = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;

  const user = await createUser(req.body);
  if (!user) {
    throw new AppError("Đăng kí thất bại", 500);
  }

  return customRes.success(
    {
      user: user,
    },
    "Đăng kí thành công",
  );
};

export const login = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  var result = await handleLogin(req.body);
  
  if (!result) {
    throw new AppError("Đăng nhập thất bại", 500);
  }

  return customRes.success(result, "Đăng nhập thành công");
};
