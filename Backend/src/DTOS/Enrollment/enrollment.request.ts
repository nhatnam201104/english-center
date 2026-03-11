export interface CandidateFormData {
  fullname: string;
  email: string;
  phone: string;
  cccd: string;
  dob: string;
  password: string;
}

export interface ParentFormData {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  existingParentId?: number;
}

export interface CreateEnrollmentDraftRequest {
  token: string;
  candidateData: CandidateFormData;
  parentData?: ParentFormData;
  scheduleId: number;
}

export interface CreatePaymentUrlRequest {
  draftId: number;
}
