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

export interface AvailableSchedule {
  id: number;
  course: {
    id: number;
    name: string;
    price: number;
    sale: number;
    courseSkill: string;
    totalSession: number;
  };
  classroom: {
    id: number;
    name: string;
    maxSize: number;
  };
  teacher: {
    id: number;
    fullname: string;
  };
  startTime: string;
  endTime: string;
  totalSlot: number;
  occupied: number;
  available: number;
}

export interface CreateDraftResponse {
  draftId: number;
  expiresAt: string;
}

export interface CreatePaymentUrlResponse {
  paymentUrl: string;
  txnRef: string;
  expiresAt: string;
}

export interface EnrollmentStatusResponse {
  txnRef: string;
  status: string;
  courseName?: string;
  scheduleInfo?: string;
  studentName?: string;
}

export interface PaymentReturnResult {
  isValid: boolean;
  txnRef: string;
  responseCode: string;
  success: boolean;
}
