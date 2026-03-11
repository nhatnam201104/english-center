import { VNPay, ignoreLogger, ProductCode, VnpLocale, HashAlgorithm } from "vnpay";

// ─── Singleton VNPay instance ───

let _vnpay: VNPay | null = null;

export function getVNPay(): VNPay {
  if (!_vnpay) {
    const tmnCode = process.env.VNP_TMN_CODE;
    const secureSecret = process.env.VNP_HASH_SECRET;

    if (!tmnCode || !secureSecret) {
      throw new Error("VNP_TMN_CODE and VNP_HASH_SECRET must be set in .env");
    }

    _vnpay = new VNPay({
      tmnCode,
      secureSecret,
      vnpayHost: "https://sandbox.vnpayment.vn",
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      enableLog: false,
      loggerFn: ignoreLogger,
    });
  }
  return _vnpay;
}

// ─── Build VNPay Payment URL ───

export const buildPaymentUrl = (params: {
  txnRef: string;
  amount: number; // final VND amount (NOT multiplied by 100 — the library handles that)
  orderInfo: string;
  ipAddr: string;
  returnUrl: string;
}): string => {
  const vnpay = getVNPay();

  return vnpay.buildPaymentUrl({
    vnp_Amount: params.amount,
    vnp_TxnRef: params.txnRef,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: params.returnUrl,
    vnp_IpAddr: params.ipAddr,
    vnp_Locale: VnpLocale.VN,
  });
};

// ─── Verify IPN (server-to-server callback from VNPay) ───

export const verifyIpn = (query: Record<string, string>) => {
  return getVNPay().verifyIpnCall(query as any);
};

// ─── Verify Return URL (browser redirect from VNPay) ───

export const verifyReturnUrl = (query: Record<string, string>) => {
  return getVNPay().verifyReturnUrl(query as any);
};

// ─── Format Date for VNPay (yyyyMMddHHmmss) ───

export const formatVnpDate = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};
