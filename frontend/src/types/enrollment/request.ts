export interface CandidateFormData {
  fullname: string;
  email: string;
  phone: string;
  cccd: string;
  dob: string;
  password: string;
}

export interface NewParentFormData {
  fullname: string;
  email: string;
  phone: string;
  password: string;
}

export interface ExistingParentLinkData {
  existingParentId: number;
  fullname?: string;
  phone?: string;
}

export type ParentFormData = NewParentFormData | ExistingParentLinkData;

export interface CreateEnrollmentDraftRequest {
  token: string;
  candidateData: CandidateFormData;
  parentData?: ParentFormData;
  scheduleId: number;
}

export interface CreatePaymentUrlRequest {
  draftId: number;
  returnUrl?: string;
}
