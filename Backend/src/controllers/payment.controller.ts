import { Request, Response } from "express";
import type { CustomResponse } from "../config/response.custom";
import {
  createPaymentUrlService,
  getPaymentHistoryService,
  getPaymentInvoiceService,
  ipnHandlerService,
  returnHandlerService,
} from "../services/payment.service";

// ─── Create Payment URL ───

export const createPaymentUrl = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const { draftId, returnUrl } = req.body;
  const rawIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "127.0.0.1";
  // VNPay requires IPv4 — map IPv6 loopback to IPv4 equivalent
  const ipAddr = rawIp === "::1" || rawIp === "::ffff:127.0.0.1" ? "127.0.0.1" : rawIp.replace(/^::ffff:/, "");

  const result = await createPaymentUrlService(draftId, ipAddr, returnUrl);
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

// ─── Payment History (authenticated user) ───

export const getPaymentHistory = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const status = req.query.status ? String(req.query.status) : undefined;

  const result = await getPaymentHistoryService(
    {
      id: req.user.id,
      role: req.user.role,
      email: req.user.email,
    },
    { page, limit, status }
  );

  return customRes.success(result, "Lấy lịch sử thanh toán thành công");
};

// ─── Invoice Detail by TxnRef (authenticated user) ───

export const getPaymentInvoice = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const txnRef = String(req.params.txnRef || "");

  const result = await getPaymentInvoiceService(
    {
      id: req.user.id,
      role: req.user.role,
      email: req.user.email,
    },
    txnRef
  );

  return customRes.success(result, "Lấy hóa đơn thành công");
};
