import prisma from "../config/database";
import { LoginRequest } from "../DTOS/Auth/LoginRequest";
import { UserResponse } from "../DTOS/User/UserResponse";
import { verifyPassword } from "../lib/bcrypt";
import { AppError } from "../middleware/errorHandler";
import { generateToken } from "../utils/jwt";
import { toUserResponse } from "../utils/Mapper/UserMapper";
import { findUserByPhone } from "./user.service";

export const handleLogin = async (req: LoginRequest): Promise<UserResponse> => {
  const user = await findUserByPhone(req.phone);
  const role = await prisma.role.findUnique({
    where: { id: user?.roleId },
  });
  if (!user) {
    throw new AppError("Số điện thoại hoặc mật khẩu không hợp lệ", 400);
  }
  if (await verifyPassword(req.password, user.password)) {
    const payload = {
      id: user.id,
      fullName: user.fullName,
      role: role?.roleName || "user",
    };
    const token = generateToken(payload);
    const refreshToken = generateToken(
      payload,
      process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
    );
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: refreshToken,
      },
    });
    (user as any).token = token;
    (user as any).refreshToken = refreshToken;
  } else {
    throw new AppError("Số điện thoại hoặc mật khẩu không hợp lệ", 400);
  }
  return toUserResponse(user);
};
