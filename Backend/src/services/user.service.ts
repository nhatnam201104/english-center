import bcrypt from "bcryptjs";

import { AppError } from "../middleware/errorHandler";
import prisma from "../config/database";
import { User } from "@prisma/client";
import { CreateUserRequest, GetUserRequest } from "../DTOS/User/user.request";
import { UserResponse } from "../DTOS/User/user.response";
import { toUserResponse } from "../utils/Mapper/user.mapper";
import { PagingData } from "../DTOS/pagination";

export const createUser = async (
  userData: CreateUserRequest,
): Promise<UserResponse> => {
  // Check if user already exists
  const existingPhone = await findUserByPhone(userData.phone);
  const existingEmail = await findUserByEmail(userData.email);
  if (existingEmail) {
    throw new AppError("Email đã tồn tại", 400);
  }
  if (existingPhone) {
    throw new AppError("Số điện thoại đã tồn tại", 400);
  }
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    return toUserResponse(user);
  } catch (error) {
    throw new AppError(
      "Lỗi khi tạo người dùng: " + (error as Error).message,
      400,
    );
  }
};

export const getAllUsers = async (
  req: GetUserRequest,
): Promise<PagingData<UserResponse>> => {
  try {
    const users = await prisma.user.findMany({
      take: req.limit,
      skip: req.page && req.limit ? (req.page - 1) * req.limit : undefined,
      orderBy: req.sortBy
        ? {
            [req.sortBy]: req.sortOrder,
          }
        : undefined,
    });
    const PagingData: PagingData<UserResponse> = {
      data: users.map(toUserResponse),
      page: req.page || 1,
      limit: req.limit || users.length,
      totalPages: req.limit ? Math.ceil(users.length / req.limit) : 1,
      totalItems: users.length,
    };
    return PagingData;
  } catch (error) {
    throw new AppError(
      "Error retrieving all users with mess: " + (error as Error).message,
      400,
    );
  }
};

export const findUserByPhone = async (phone: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { phone },
    });
    return user;
  } catch (error) {
    throw new AppError(
      "Error retrieving user by phone with mess: " + (error as Error).message,
      400,
    );
  }
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    throw new AppError(
      "Error retrieving user by email with mess: " + (error as Error).message,
      400,
    );
  }
};
export const findUserById = async (id: number): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    throw new AppError(
      "Error retrieving user by ID with mess: " + (error as Error).message,
      400,
    );
  }
};
