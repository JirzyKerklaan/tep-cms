import express, { Request, Response, NextFunction } from 'express';
import config from '../config';

const router = express.Router();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session?.user) {
    return next();
  }
  res.redirect('/manager/login'); // Redirect stays absolute
}


router.get('/login', (req: Request, res: Response) => {
  res.render('views/login', {
    layout: 'main',
    error: null,
    username: ''
  });
});

// Handle login form submission
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === config.auth.username && password === config.auth.password) {
    req.session.user = { username };
    return res.redirect('/manager/dashboard');
  }

  res.status(401).render('login', {
    layout: 'main',
    error: 'Invalid username or password',
    username
  });
});

router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/')
  });
});

// Apply auth middleware for protected routes below
router.use(isAuthenticated);

router.get('/dashboard', (req: Request, res: Response) => {
  res.render('views/dashboard', { layout: 'manager', user: req.session.user });
});

export default router;
