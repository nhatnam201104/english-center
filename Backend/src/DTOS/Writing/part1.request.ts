export interface CreatePart1Request {
  index: number;
  imageOne: string;
  imageTwo: string;
  imageThree: string;
  imageFour: string;
  imageFive: string;
}

export interface UpdatePart1Request {
  imageOne?: string;
  imageTwo?: string;
  imageThree?: string;
  imageFour?: string;
  imageFive?: string;
}