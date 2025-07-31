import express, { Request, Response, NextFunction } from 'express';
import config from '../config';
import { collectionController, blockController, entryController } from '../manager/controllers';
import { findUser, loadUsers, verifyPassword } from '../services/userService';

const router = express.Router();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // return;
  
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

  router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    await loadUsers(); // Refresh user list (optional for performance if loaded once at startup)

    const user = findUser(username);
    if (!user) {
      return res.status(401).render('manager/login', {
        error: 'Invalid username or password',
        username,
      });
    }

    const passwordValid = await verifyPassword(user, password);
    if (!passwordValid) {
      return res.status(401).render('manager/login', {
        error: 'Invalid username or password',
        username,
      });
    }

    // Login successful — store user data in session
    req.session.user = {
      username: user.username
    };

    return res.redirect('/manager/');
  });


router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/')
  });
});

// -------------------- //

router.use(isAuthenticated);

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

router.get('/collections/entry/new', entryController.newForm);
router.post('/collections/new', entryController.create);

router.get('/collections/entry/edit/:id', entryController.editForm);
router.post('/collections/entry/edit/:id', entryController.update);

router.post('/collections/entry/delete/:id', entryController.delete);

router.get('/collections/entry/list', entryController.list);

// -------------------- //

router.get('/blocks/new', blockController.newForm);
router.post('/blocks/new', blockController.create);

router.get('/blocks/edit/:id', blockController.editForm);
router.post('/blocks/edit/:id', blockController.update);

router.post('/blocks/delete/:id', blockController.delete);

router.get('/blocks/list', blockController.list);

// -------------------- //

export default router;
