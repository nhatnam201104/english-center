import { CustomResponse } from "../config/response.custom";
import { Response, Request } from "express";
import { GetUserRequest } from "../DTOS/User/UserRequest";
import { getAllUsers } from "../services/user.service";
import { AppError } from "../middleware/errorHandler";
export const getAllUsersController = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  var queryParams: GetUserRequest = {
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    sortBy: req.query.sortBy ? String(req.query.sortBy) : undefined,
    sortOrder:
      req.query.sortOrder === "asc"
        ? "asc"
        : req.query.sortOrder === "desc"
          ? "desc"
          : undefined,
  };

  const users = await getAllUsers(queryParams);
  if (!users) {
    throw new AppError("Lấy danh sách người dùng thất bại", 400);
  }
  return customRes.success(users, "Lấy danh sách người dùng thành công");
};
