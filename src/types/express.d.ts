import 'express';

declare module 'express' {
  interface Request {
    cookies?: {
      [key: string]: string;
    };
    user?: {
      sub: string;
      email: string;
      role: string;
    };
  }
}
