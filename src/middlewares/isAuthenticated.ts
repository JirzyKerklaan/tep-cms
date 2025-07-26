function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // This is a simple example, adjust according to your auth system
  if (req.session && req.session.user) {
    return next();
  }
  // If not authenticated, redirect to login or send 401
  return res.redirect('/login');
}
