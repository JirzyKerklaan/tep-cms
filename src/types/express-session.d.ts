import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean; // your custom session properties
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: import('express-session').Session & Partial<import('express-session').SessionData>;
  }
}
