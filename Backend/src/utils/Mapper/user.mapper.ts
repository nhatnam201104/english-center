import { User } from "@prisma/client";

export const toUserResponse = (user: User) => ({
  id: user.id,
  fullname: user.fullname,
  email : user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
  token: (user as any).token,
});
