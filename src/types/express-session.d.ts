// src/express-ejs-layouts.d.ts

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      username: string;
    };
  }
}
