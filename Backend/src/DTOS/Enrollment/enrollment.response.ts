export interface ValidateTokenResponse {
  admissionId: number;
  admissionType: string;
  fullname: string;
  email: string;
  phone: string;
  cccd: string;
  tokenId: number;
}

export interface CheckParentResponse {
  found: boolean;
  parentId?: number;
  fullname?: string;
  phone?: string;
}

export interface CreateDraftResponse {
  draftId: number;
  expiresAt: Date;
}

export interface EnrollmentStatusResponse {
  txnRef: string;
  status: string;
  courseName?: string;
  scheduleInfo?: string;
  studentName?: string;
}

export interface CreatePaymentUrlResponse {
  paymentUrl: string;
  txnRef: string;
  expiresAt: Date;
}
