import { User } from "@prisma/client";

export const toUserResponse = (user: User) => ({
  id: user.id,
  fullName: user.fullName,
  phone: user.phone,
  roleId: user.roleId,
  createdAt: user.createdAt,
  token: (user as any).token,
  refreshToken: (user as any).refreshToken,
});
