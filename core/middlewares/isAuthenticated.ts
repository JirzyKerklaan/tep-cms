import { Request, Response, NextFunction } from "express";

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.redirect("/manager/login");
}
