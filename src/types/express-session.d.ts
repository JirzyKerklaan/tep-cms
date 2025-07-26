import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: import('express-session').Session & Partial<import('express-session').SessionData>;
  }
}
