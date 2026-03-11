import { create } from "zustand";
import type {
  AttemptStateResponse,
  ListeningPartData,
  ReadingPartData,
  ScoreResponse,
} from "../types/entrance-exam/candidate.types";

type ExamPhase =
  | "idle"
  | "registered"
  | "listening"
  | "listening_done"
  | "reading"
  | "completed"
  | "cancelled";

interface ExamState {
  phase: ExamPhase;
  accessToken: string | null;
  admissionId: number | null;
  listeningParts: ListeningPartData[];
  readingParts: ReadingPartData[];
  answers: Record<string, number>; // "L-1" => 2, "R-5" => 3
  listeningScore: number | null;
  readingScore: number | null;
  scoreResult: ScoreResponse | null;
  expiresAt: string | null;
  readingTimeMinutes: number | null;

  setRegistered: (admissionId: number) => void;
  startAttempt: (accessToken: string, expiresAt: string) => void;
  restoreState: (state: AttemptStateResponse) => void;
  setListeningData: (parts: ListeningPartData[]) => void;
  setReadingData: (parts: ReadingPartData[], readingTimeMinutes: number) => void;
  setAnswer: (section: "L" | "R", questionIndex: number, answerId: number) => void;
  finishListening: (score: number) => void;
  finishExam: (result: ScoreResponse) => void;
  cancelExam: () => void;
  reset: () => void;
}

const initialState = {
  phase: "idle" as ExamPhase,
  accessToken: null as string | null,
  admissionId: null as number | null,
  listeningParts: [] as ListeningPartData[],
  readingParts: [] as ReadingPartData[],
  answers: {} as Record<string, number>,
  listeningScore: null as number | null,
  readingScore: null as number | null,
  scoreResult: null as ScoreResponse | null,
  expiresAt: null as string | null,
  readingTimeMinutes: null as number | null,
};

export const useExamStore = create<ExamState>()((set) => ({
  ...initialState,

  setRegistered: (admissionId) =>
    set({ phase: "registered", admissionId }),

  startAttempt: (accessToken, expiresAt) =>
    set({ accessToken, expiresAt, phase: "registered" }),

  restoreState: (state) => {
    const phaseMap: Record<string, ExamPhase> = {
      REGISTERED: "registered",
      PENDING: "registered",
      LISTENING: "listening",
      LISTENING_DONE: "listening_done",
      READING: "reading",
      COMPLETED: "completed",
      CANCELLED: "cancelled",
    };
    set({ phase: phaseMap[state.status] ?? "idle" });
  },

  setListeningData: (parts) =>
    set({ listeningParts: parts, phase: "listening" }),

  setReadingData: (parts, readingTimeMinutes) =>
    set({ readingParts: parts, readingTimeMinutes, phase: "reading" }),

  setAnswer: (section, questionIndex, answerId) =>
    set((s) => ({
      answers: { ...s.answers, [`${section}-${questionIndex}`]: answerId },
    })),

  finishListening: (score) =>
    set({ listeningScore: score, phase: "listening_done" }),

  finishExam: (result) =>
    set({ scoreResult: result, phase: "completed" }),

  cancelExam: () =>
    set({ phase: "cancelled" }),

  reset: () => set(initialState),
}));
