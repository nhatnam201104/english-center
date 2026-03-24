import { create } from "zustand";
import type { AvailableSchedule } from "../types/enrollment/response";
import type { ParentFormData } from "../types/enrollment/request";

type StudentRegistrationStep =
  | "profile-parent"
  | "schedule-select"
  | "checkout"
  | "payment";

interface StudentRegistrationState {
  step: StudentRegistrationStep;
  parentData: ParentFormData | null;
  selectedSchedule: AvailableSchedule | null;
  draftId: number | null;
  txnRef: string | null;
  expiresAt: string | null;

  scheduleFilterMonth: string;
  scheduleFilterTeacher: string;
  scheduleFilterAvailableOnly: boolean;

  setParentData: (data: ParentFormData | null) => void;
  setSelectedSchedule: (schedule: AvailableSchedule) => void;
  setDraft: (draftId: number, expiresAt: string) => void;
  setPayment: (txnRef: string) => void;
  setStep: (step: StudentRegistrationStep) => void;
  setScheduleFilter: (filters: {
    month?: string;
    teacher?: string;
    availableOnly?: boolean;
  }) => void;
  resetScheduleFilters: () => void;
  reset: () => void;
}

const initialState = {
  step: "profile-parent" as StudentRegistrationStep,
  parentData: null as ParentFormData | null,
  selectedSchedule: null as AvailableSchedule | null,
  draftId: null as number | null,
  txnRef: null as string | null,
  expiresAt: null as string | null,
  scheduleFilterMonth: "",
  scheduleFilterTeacher: "",
  scheduleFilterAvailableOnly: false,
};

export const useStudentRegistrationStore = create<StudentRegistrationState>()(
  (set) => ({
    ...initialState,

    setParentData: (data) => set({ parentData: data, step: "schedule-select" }),
    setSelectedSchedule: (schedule) => set({ selectedSchedule: schedule, step: "checkout" }),
    setDraft: (draftId, expiresAt) => set({ draftId, expiresAt }),
    setPayment: (txnRef) => set({ txnRef, step: "payment" }),
    setStep: (step) => set({ step }),
    setScheduleFilter: (filters) =>
      set((state) => ({
        scheduleFilterMonth: filters.month ?? state.scheduleFilterMonth,
        scheduleFilterTeacher: filters.teacher ?? state.scheduleFilterTeacher,
        scheduleFilterAvailableOnly:
          filters.availableOnly ?? state.scheduleFilterAvailableOnly,
      })),
    resetScheduleFilters: () =>
      set({
        scheduleFilterMonth: "",
        scheduleFilterTeacher: "",
        scheduleFilterAvailableOnly: false,
      }),
    reset: () => set(initialState),
  }),
);
