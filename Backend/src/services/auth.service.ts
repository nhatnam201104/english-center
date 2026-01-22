import { LoginRequest } from "../DTOS/Auth/LoginRequest";
import { UserResponse } from "../DTOS/User/user.response";
import { verifyPassword } from "../lib/bcrypt";
import { AppError } from "../middleware/errorHandler";
import { generateToken } from "../utils/jwt";
import { toUserResponse } from "../utils/Mapper/user.mapper";
import { findUserByPhone } from "./user.service";

export const handleLogin = async (req: LoginRequest): Promise<UserResponse> => {
  const user = await findUserByPhone(req.phone);

  if (!user) {
    throw new AppError("Số điện thoại hoặc mật khẩu không hợp lệ", 400);
  }
  if (await verifyPassword(req.password, user.password)) {
    const payload = {
      id: user.id,
      fullname: user.fullname,
      role: user.role,
    };
    const token = generateToken(payload);

    (user as any).token = token;
  } else {
    throw new AppError("Số điện thoại hoặc mật khẩu không hợp lệ", 400);
  }
  return toUserResponse(user);
};
