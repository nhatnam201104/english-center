export interface JwtPayload {
  id: number;
  role: string;
  fullname: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
    
  }
}

export {};
