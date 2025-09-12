// middlewares/session.ts
import session from 'express-session';
import config from '../../src/config';

export const sessionMiddleware = session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
});
