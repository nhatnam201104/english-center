export interface SpeakingResponse {
  id: number;
  name: string;
  isDone: boolean;
  isActive: boolean;
  totalQuestion: number;
  createdAt: string;
  updatedAt: string;
  speakingOneTwos?: SpeakingOneTwo[];
  speakingThreeFours?: SpeakingThreeFour[];
  speakingFiveToSevens?: SpeakingFiveToSeven[];
  speakingEightToTens?: SpeakingEightToTen[];
  speakingElevens?: SpeakingEleven[];
}

export interface SpeakingOneTwo {
  id: number;
  index: number;
  speakingExamId: number;
  questionOne: string;
  questionTwo: string;
  createdAt: string;
}

export interface SpeakingThreeFour {
  id: number;
  index: number;
  speakingExamId: number;
  imageThree: string;
  imageFour: string;
  createdAt: string;
}

export interface SpeakingFiveToSeven {
  id: number;
  index: number;
  speakingExamId: number;
  passage: string;
  questionFive: string;
  questionSix: string;
  questionSeven: string;
  createdAt: string;
}

export interface SpeakingEightToTen {
  id: number;
  index: number;
  speakingExamId: number;
  passage: string;
  questionEight: string;
  questionNine: string;
  questionTen: string;
  image: string | null;
  createdAt: string;
}

export interface SpeakingEleven {
  id: number;
  index: number;
  speakingExamId: number;
  question: string;
  createdAt: string;
}

export interface PaginatedSpeakingResponse {
  data: SpeakingResponse[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}