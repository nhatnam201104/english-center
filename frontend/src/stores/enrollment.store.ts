import { create } from "zustand";
import type { ValidateTokenResponse, AvailableSchedule } from "../types/enrollment/response";
import type { CandidateFormData, ParentFormData } from "../types/enrollment/request";

type EnrollmentStep = "loading" | "student-form" | "schedule-select" | "checkout" | "payment";

interface EnrollmentState {
  step: EnrollmentStep;
  token: string | null;
  tokenData: ValidateTokenResponse | null;
  candidateData: CandidateFormData | null;
  parentData: ParentFormData | null;
  selectedSchedule: AvailableSchedule | null;
  draftId: number | null;
  txnRef: string | null;
  expiresAt: string | null;

  setToken: (token: string) => void;
  setTokenData: (data: ValidateTokenResponse) => void;
  setCandidateData: (data: CandidateFormData) => void;
  setParentData: (data: ParentFormData | null) => void;
  setSelectedSchedule: (schedule: AvailableSchedule) => void;
  setDraft: (draftId: number, expiresAt: string) => void;
  setPayment: (txnRef: string) => void;
  setStep: (step: EnrollmentStep) => void;
  reset: () => void;
}

const initialState = {
  step: "loading" as EnrollmentStep,
  token: null as string | null,
  tokenData: null as ValidateTokenResponse | null,
  candidateData: null as CandidateFormData | null,
  parentData: null as ParentFormData | null,
  selectedSchedule: null as AvailableSchedule | null,
  draftId: null as number | null,
  txnRef: null as string | null,
  expiresAt: null as string | null,
};

export const useEnrollmentStore = create<EnrollmentState>()((set) => ({
  ...initialState,

  setToken: (token) => set({ token }),
  setTokenData: (data) => set({ tokenData: data, step: "student-form" }),
  setCandidateData: (data) => set({ candidateData: data, step: "schedule-select" }),
  setParentData: (data) => set({ parentData: data }),
  setSelectedSchedule: (schedule) => set({ selectedSchedule: schedule, step: "checkout" }),
  setDraft: (draftId, expiresAt) => set({ draftId, expiresAt }),
  setPayment: (txnRef) => set({ txnRef, step: "payment" }),
  setStep: (step) => set({ step }),
  reset: () => set(initialState),
}));
