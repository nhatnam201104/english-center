export interface JwtPayload {
  id: number;
  role: string;
  fullName: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
    
  }
}

export {};
