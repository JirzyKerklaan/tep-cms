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
    return res.redirect('/manager/');
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
// router.use(isAuthenticated);

router.get('/', (req: Request, res: Response) => {
  res.render('manager/dashboard', { layout: 'manager', user: req.session.user });
});

router.get('/collections/create', collectionController.newForm);
router.post('/collections/create', collectionController.create);

router.get('/collections/edit/:id', collectionController.editForm);
router.post('/collections/edit/:id', collectionController.update);

router.get('/collections/list', collectionController.list);

export default router;
