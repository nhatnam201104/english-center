export interface CreatePart2Request {
  index: number;
  imageThree: string;
  imageFour: string;
}

export interface UpdatePart2Request {
  imageThree?: string;
  imageFour?: string;
}