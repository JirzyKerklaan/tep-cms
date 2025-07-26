import { Request, Response, NextFunction } from 'express';

export function ensureAdminAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session?.isAdmin) {
    return next();
  }
  res.redirect('/login');
}
