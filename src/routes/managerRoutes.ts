import express, { Request, Response, NextFunction } from 'express';
import config from '../config';
import collectionController from '../manager/controllers/collectionController';

const router = express.Router();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session?.user) {
    return next();
  }
  res.redirect('/manager/login'); // Redirect stays absolute
}


router.get('/login', (req: Request, res: Response) => {
  res.render('manager/login', {
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
  res.render('manager/dashboard', { layout: 'manager', user: req.session.user });
});

router.get('/collection/create', collectionController.newForm);
router.post('/collection/create', collectionController.create);

router.get('/collection/edit/:id', collectionController.editForm);
router.post('/collection/edit/:id', collectionController.update);

router.get('/collection/list', collectionController.list);

export default router;
