export interface SpeakingResponse {
  id: number;
  name: string;
  isDone: boolean;
  isActive: boolean;
  totalQuestion: number;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
}

export interface SpeakingThreeFour {
  id: number;
  index: number;
  speakingExamId: number;
  imageThree: string;
  imageFour: string;
  createdAt: Date;
}

export interface SpeakingFiveToSeven {
  id: number;
  index: number;
  speakingExamId: number;
  passage: string;
  questionFive: string;
  questionSix: string;
  questionSeven: string;
  createdAt: Date;
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
  createdAt: Date;
}

export interface SpeakingEleven {
  id: number;
  index: number;
  speakingExamId: number;
  question: string;
  createdAt: Date;
}