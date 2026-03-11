import { Request, Response } from "express";
import type { CustomResponse } from "../config/response.custom";
import {
  createPaymentUrlService,
  ipnHandlerService,
  returnHandlerService,
} from "../services/payment.service";

// ─── Create Payment URL ───

export const createPaymentUrl = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const { draftId } = req.body;
  const rawIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "127.0.0.1";
  // VNPay requires IPv4 — map IPv6 loopback to IPv4 equivalent
  const ipAddr = rawIp === "::1" || rawIp === "::ffff:127.0.0.1" ? "127.0.0.1" : rawIp.replace(/^::ffff:/, "");

  const result = await createPaymentUrlService(draftId, ipAddr);
  return customRes.success(result, "Tạo link thanh toán thành công");
};

// ─── VNPay IPN (server-to-server callback) ───

export const ipnHandler = async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await ipnHandlerService(query);

  // VNPay expects this exact JSON format
  return res.status(200).json(result);
};

// ─── VNPay Return URL (browser redirect) ───

export const returnHandler = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const query = req.query as Record<string, string>;
  const result = await returnHandlerService(query);
  return customRes.success(result);
};
