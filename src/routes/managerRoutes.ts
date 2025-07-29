import express, { Request, Response, NextFunction } from 'express';
import config from '../config';
import { collectionController, blockController } from '../manager/controllers';

const router = express.Router();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session?.user) {
    return next();
  }
  res.redirect('/manager/login');
}

router.get('/login', (req: Request, res: Response) => {
  res.render('manager/login', {
    error: null,
    username: ''
  });
});

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === config.auth.username && password === config.auth.password) {
    req.session.user = { username };
    return res.redirect('/manager/');
  }

  res.status(401).render('login', {
    error: 'Invalid username or password',
    username
  });
});

router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/')
  });
});

// -------------------- //

// router.use(isAuthenticated);

router.get('/', (req: Request, res: Response) => {
  res.render('manager/dashboard', { layout: 'layouts/manager', user: req.session.user });
});

// -------------------- //

router.get('/collections/new', collectionController.newForm);
router.post('/collections/new', collectionController.create);

router.get('/collections/edit/:id', collectionController.editForm);
router.post('/collections/edit/:id', collectionController.update);

router.post('/collections/delete/:id', collectionController.delete);

router.get('/collections/list', collectionController.list);

// -------------------- //

router.get('/blocks/new', blockController.newForm);
router.post('/blocks/new', blockController.create);

router.get('/blocks/edit/:id', blockController.editForm);
router.post('/blocks/edit/:id', blockController.update);

router.post('/blocks/delete/:id', blockController.delete);

router.get('/blocks/list', blockController.list);

// -------------------- //

export default router;
