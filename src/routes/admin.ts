import express, { Request, Response } from 'express';
import { collectionController, blockController, entryController } from '../../core/admin/controllers';
import {createPassword, findEmail, findUsername, loadUsers, verifyPassword} from '../../core/services/userService';
import { ERROR_CODES, ErrorCode } from '../utils/errors';
import fs from 'fs-extra';
import path from "path";
import {isAuthenticated} from '../../core/middlewares/isAuthenticated';

const router = express.Router();

router.get('/login', (req: Request, res: Response) => {
  res.render('admin/login', {
    error: ERROR_CODES["TEP200"],
    username: ''
  });
});

  router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    await loadUsers();

    const user = findUsername(username);
    if (!user) {
      res.status(401).render('admin/login', {
        error: ERROR_CODES["TEP111"],
        username,
      });
      return;
    }

    const passwordValid = await verifyPassword(user, password);
    if (!passwordValid) {
      res.status(401).render('admin/login', {
        error: ERROR_CODES["TEP111"],
        username,
      });
      return;
    }

    req.session.user = {
      username: user.username,
      role: user.role
    };

    res.redirect('/admin/');
    return;
  });


router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/')
  });
});

// -------------------- //

router.get('/register', (req: Request, res: Response) => {
  res.render('admin/register', {
    error: ERROR_CODES["TEP200"],
    email: '',
    username: ''
  });
});

router.post('/register', async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  await loadUsers();

  const usernameIsRecognised = findUsername(username);
  const emailIsRecognised = findEmail(email);

  let errorCode: ErrorCode | null = null;

  if (emailIsRecognised) {
    errorCode = 'TEP121';
  } else if (usernameIsRecognised) {
    errorCode = 'TEP122';
  }

  if (errorCode) {
    res.status(401).render('admin/register', { error: ERROR_CODES[errorCode], username, email });
    return;
  }

  try {
    const userPath = path.join(process.cwd(), 'content', 'users');

    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath, {recursive: true});
    }

    const safeUsername = username
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-_]/g, '');

    const filePath = path.join(userPath, `${safeUsername}.json`);

    const userData = {
      username: username,
      passwordHash: await createPassword(password),
      role: 'admin',
      email: email
    };

    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf8');
  } catch {
    res.status(401).render('admin/register', { error: ERROR_CODES["TEP450"] });
    return;
  }

  res.status(401).redirect('/admin/login');
  return;
});

// -------------------- //

router.use(isAuthenticated);

router.get('/', (req: Request, res: Response) => {
  res.render('admin/dashboard', { layout: 'layouts/admin', user: req.session.user });
});

// --------- Collections ----------- //

router.get('/collections/new', collectionController.newForm);
router.post('/collections/new', collectionController.create);

router.get('/collections/edit/:id', collectionController.editForm);
router.post('/collections/edit/:id', collectionController.update);

router.post('/collections/delete/:id', collectionController.delete);

router.get('/collections', collectionController.list);

// --------- Entries ----------- //

router.get('/collections/:collection/new', entryController.newForm);
router.post('/collections/:collection/new', entryController.create);

router.get('/collections/:collection/edit/:id', entryController.editForm);
router.post('/collections/:collection/edit/:id', entryController.update);

router.post('/collections/:collection/delete/:id', entryController.delete);

router.get('/collections/:collection', entryController.list);

// --------- Blocks ----------- //

router.get('/blocks/new', blockController.newForm);
router.post('/blocks/new', blockController.create);

router.get('/blocks/edit/:id', blockController.editForm);
router.post('/blocks/edit/:id', blockController.update);

router.post('/blocks/delete/:id', blockController.delete);

router.get('/blocks', blockController.list);

// --------- CatchAll ----------- //

router.use('*', (req, res) => {
  res.status(404).render('admin/404', { layout: 'layouts/admin', user: req.session.user });
});

// -------------------- //

export default router;
