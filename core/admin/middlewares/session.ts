import session from 'express-session';
import config from "@root/config";

export const sessionMiddleware = session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
});
