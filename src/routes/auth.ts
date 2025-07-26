import { Router, Request, Response } from 'express';
import config from '../config';

const authRouter = Router();

// Render login form
authRouter.get('/login', (req: Request, res: Response) => {
  res.render('auth/login'); // you will create auth/login.hbs
});

// Handle login POST
authRouter.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Simple example - replace with real auth
  if (username === config.auth.username && password === config.auth.password) {
    req.session.isAdmin = true;
    return res.redirect('/manager');
  }

  // Invalid login
  res.render('auth/login', { error: 'Invalid credentials' });
});

// Handle logout via GET
authRouter.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


export default authRouter;
