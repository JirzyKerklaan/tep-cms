import express, { Request, Response, NextFunction } from 'express';
import { collectionController, blockController, entryController } from '../manager/controllers';
import {createPassword, findEmail, findUsername, loadUsers, verifyPassword} from '../services/userService';
import { ERROR_CODES, ErrorCode } from '../utils/errors';
import fs from 'fs-extra';
import path from "path";

const router = express.Router();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session?.user) {
    return next();
  }
  res.redirect('/manager/login');
}

router.get('/login', (req: Request, res: Response) => {
  res.render('manager/login', {
    error: ERROR_CODES["TEP200"],
    username: ''
  });
});

  router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    await loadUsers();

    const user = findUsername(username);
    if (!user) {
      return res.status(401).render('manager/login', {
        error: ERROR_CODES["TEP111"],
        username,
      });
    }

    const passwordValid = await verifyPassword(user, password);
    if (!passwordValid) {
      return res.status(401).render('manager/login', {
        error: ERROR_CODES["TEP111"],
        username,
      });
    }

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

router.get('/register', (req: Request, res: Response) => {
  res.render('manager/register', {
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
    return res.status(401).render('manager/register', { error: ERROR_CODES[errorCode], username, email });
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
    return res.status(401).render('manager/register', { error: ERROR_CODES["TEP450"] });
  }

  return res.status(401).redirect('/manager/login');
});

// -------------------- //

// router.use(isAuthenticated);

router.get('/', (req: Request, res: Response) => {
  res.render('manager/dashboard', { layout: 'layouts/manager', user: req.session.user });
});

// -------------------- //

router.get('/collections/create', collectionController.newForm);
router.post('/collections/create', collectionController.create);

router.get('/collections/edit/:id', collectionController.editForm);
router.post('/collections/edit/:id', collectionController.update);

router.post('/collections/delete/:id', collectionController.delete);

router.get('/collections', collectionController.list);

// -------------------- //

router.get('/blocks/create', blockController.newForm);
router.post('/blocks/create', blockController.create);

router.get('/blocks/edit/:id', blockController.editForm);
router.post('/blocks/edit/:id', blockController.update);

router.post('/blocks/delete/:id', blockController.delete);

router.get('/blocks', blockController.list);

// -------------------- //

router.use('*', (req, res) => {
  res.status(404).render('manager/404', { layout: 'layouts/manager', user: req.session.user });
});

// -------------------- //

export default router;
